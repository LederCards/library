/* eslint-disable @typescript-eslint/no-explicit-any */
import { isString } from 'lodash';
import * as parser from 'search-query-parser';

import { type ICard } from '../interfaces';

import { bare, card, inC, name, tag } from './operators';

const allKeywords = [
  ['id'], // exact text
  ['in'], // special operator
  ['name', 'n'], // loose text
  ['tag'], // array search
];

const operators = [inC, card, name, tag];

export function properOperatorsInsteadOfAliases(
  result: parser.SearchParserResult
): parser.SearchParserResult {
  allKeywords.forEach((keyword) => {
    if (keyword.length === 1) {
      return;
    }

    keyword.slice(1).forEach((alias) => {
      if (result[alias]) {
        result[keyword[0]] = result[alias];
        delete result[alias];
      }
      if (result.exclude?.[alias]) {
        result.exclude[keyword[0]] = result.exclude[alias];
        delete result.exclude[alias];
      }
    });
  });

  return result;
}

const allQueryFormatters = [
  {
    key: 'id',
    includes: 'is',
    excludes: 'is not',
    formatter: (result: Record<string, any>) => {
      const value = result['id'];
      return `${value}`;
    },
  },
  {
    key: 'expansion',
    includes: 'has',
    excludes: 'does not have',
    formatter: (result: Record<string, any>) => {
      const value = result['expansion'];
      const expansions: string[] = isString(value)
        ? [value]
        : (value as unknown as string[]);
      return `${expansions.map((x) => `"${x}"`).join(' or ')}`;
    },
  },
  {
    key: 'name',
    includes: 'contains',
    excludes: 'does not contain',
    formatter: (result: Record<string, any>) => {
      const value = result['name'];
      return `"${value}"`;
    },
  },
  {
    key: 'set',
    includes: 'is',
    excludes: 'is not',
    formatter: (result: Record<string, any>) => {
      const value = result['set'];
      return `${value}`;
    },
  },
  {
    key: 'tag',
    includes: 'has',
    excludes: 'does not have',
    formatter: (result: Record<string, any>) => {
      const value = result['tag'];
      const tags: string[] = isString(value)
        ? [value]
        : (value as unknown as string[]);
      return `${tags.map((x) => `"${x}"`).join(' or ')}`;
    },
  },
];

export function queryToText(query: string): string {
  query = query.toLowerCase().trim();

  const firstResult = parser.parse(query, {
    keywords: allKeywords.flat(),
    offsets: false,
  }) as parser.SearchParserResult;
  if (isString(firstResult)) {
    const queries = query
      .split(' ')
      .map((x) => `"${x}"`)
      .join(' or ');
    return `cards with ${queries} in the name, abilities, expansion, or code`;
  }

  const result = properOperatorsInsteadOfAliases(firstResult);

  const text = [];

  allQueryFormatters.forEach((queryFormatter) => {
    const { key, includes, excludes, formatter } = queryFormatter;

    if (result[key]) {
      text.push(`${key} ${includes} ${formatter(result)}`);
    }
    if (result.exclude?.[key]) {
      text.push(`${key} ${excludes} ${formatter(result.exclude)}`);
    }
  });

  if (result['in']) {
    text.push(`in ${result['in']}`);
  }

  return `cards where ${text.join(' and ')}`;
}

export function parseQuery(
  cards: ICard[],
  query: string,
  extraData = {}
): ICard[] {
  query = query.toLowerCase().trim();

  const result = parser.parse(query, {
    keywords: allKeywords.flat(),
    offsets: false,
  });

  // the parser returns a string if there's nothing interesting to do, for some reason
  // so we have a bare words parser
  if (isString(result)) {
    return bare(cards, query, extraData);
  }

  const resultText = (result as parser.SearchParserResult).text as string;

  let returnCards = cards;

  if (resultText) {
    returnCards = bare(returnCards, resultText, extraData);
  }

  // check all the operators
  operators.forEach((operator) => {
    returnCards = operator(
      returnCards,
      result as parser.SearchParserResult,
      extraData
    );
  });

  return returnCards;
}
