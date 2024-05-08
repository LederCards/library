/* eslint-disable @typescript-eslint/no-explicit-any */
import { isString } from 'lodash';
import * as parser from 'search-query-parser';

import { type ICard } from '../interfaces';

import { bare, card, name, product, subproduct, tag } from './operators';

const allKeywords = [
  ['id'], // exact text
  ['name', 'n'], // loose text
  ['game', 'g'], // exact text
  ['product', 'expansion', 'p', 'e'], // exact text
  ['tag'], // array search
];

export type ParserOperator = (
  cards: ICard[],
  results: parser.SearchParserResult
) => ICard[];

const operators: ParserOperator[] = [card, name, product, subproduct, tag];

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
    key: 'name',
    includes: 'contains',
    excludes: 'does not contain',
    formatter: (result: Record<string, any>) => {
      const value = result['name'];
      return `"${value}"`;
    },
  },
  {
    key: 'game',
    includes: 'is',
    excludes: 'is not',
    formatter: (result: Record<string, any>) => {
      const value = result['game'];
      return `${value}`;
    },
  },
  {
    key: 'product',
    includes: 'is',
    excludes: 'is not',
    formatter: (result: Record<string, any>) => {
      const value = result['product'];
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
    return `cards with ${queries} in the name or card id`;
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

  if (result['text']) {
    text.push(`${result['text']} is in name or card id`);
  }

  return `cards where ${text.join(' and ')}`;
}

export function getProductFromQuery(query: string): string | undefined {
  query = query.toLowerCase().trim();

  const validKeywords = [allKeywords].flat(2);

  const result = parser.parse(query, {
    keywords: validKeywords,
    offsets: false,
  });

  if (isString(result)) return undefined;

  return result['game'];
}

export function parseQuery(
  cards: ICard[],
  query: string,
  extraOperators: Array<{ aliases: string[]; operator: ParserOperator }> = []
): ICard[] {
  query = query.toLowerCase().trim();

  const validKeywords = [
    allKeywords,
    ...extraOperators.map((o) => o.aliases),
  ].flat(2);

  const result = parser.parse(query, {
    keywords: validKeywords,
    offsets: false,
  });

  // the parser returns a string if there's nothing interesting to do, for some reason
  // so we have a bare words parser
  if (isString(result)) {
    return bare(cards, query);
  }

  const resultText = (result as parser.SearchParserResult).text as string;

  let returnCards = cards;

  if (resultText) {
    returnCards = bare(returnCards, resultText);
  }

  // check all the operators
  [operators, extraOperators.map((o) => o.operator)]
    .flat()
    .forEach((operator) => {
      returnCards = operator(returnCards, result as parser.SearchParserResult);
    });

  return returnCards;
}
