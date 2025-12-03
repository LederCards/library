/* eslint-disable @typescript-eslint/no-explicit-any */
import { isString } from 'lodash';
import * as parser from 'search-query-parser';

import { type ICard } from '../interfaces';

import {
  bare,
  card,
  errata,
  faq,
  name,
  product,
  subproduct,
  tag,
  text,
} from './operators';

const allKeywords = [
  ['id'], // exact text
  ['name', 'n'], // loose text
  ['cardtext', 't'], // loose text
  ['game', 'g'], // exact text
  ['faq', 'f'], // numerical
  ['errata', 'e'], // numerical
  ['product', 'expansion', 'p', 'e'], // exact text
  ['tag'], // array search
];

export type ParserOperator = (
  cards: ICard[],
  results: parser.SearchParserResult
) => ICard[];

const operators: ParserOperator[] = [
  card,
  name,
  text,
  faq,
  errata,
  product,
  subproduct,
  tag,
];

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
    key: 'cardtext',
    includes: 'contains',
    excludes: 'does not contain',
    formatter: (result: Record<string, any>) => {
      const value = result['cardtext'];
      return `"${value}"`;
    },
  },
  {
    key: 'errata',
    includes: 'is',
    excludes: 'is not',
    formatter: (result: Record<string, any>) => {
      const value = result['errata'] ?? 0;
      return `${value}`;
    },
  },
  {
    key: 'faq',
    includes: 'is',
    excludes: 'is not',
    formatter: (result: Record<string, any>) => {
      const value = result['faq'] ?? 0;
      return `${value}`;
    },
  },
  /*
  {
    key: 'game',
    includes: 'is',
    excludes: 'is not',
    formatter: (result: Record<string, any>) => {
      const value = result['game'];
      return `${value}`;
    },
  },
  */
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
    includes: 'is',
    excludes: 'is not',
    formatter: (result: Record<string, any>) => {
      const value = result['tag'];
      const tags: string[] = isString(value)
        ? [value]
        : (value as unknown as string[]);
      return `${tags.map((x) => `"${x}"`).join(' and ')}`;
    },
  },
];

export function queryToText(query: string, isPlural = true): string {
  query = query.toLowerCase().trim();

  const firstResult = parser.parse(query, {
    keywords: allKeywords.flat(),
    offsets: false,
  }) as parser.SearchParserResult;

  const cardText = `card${isPlural ? 's' : ''}`;

  if (isString(firstResult)) {
    if (!firstResult) {
      return cardText;
    }

    const queries = query
      .split(' ')
      .map((x) => `"${x}"`)
      .join(' or ');
    return `${cardText} with ${queries} in the name or card id`;
  }

  const result = properOperatorsInsteadOfAliases(firstResult);

  const textArrayEntries = [];

  const gameResult = result['game'];
  if (gameResult) {
    textArrayEntries.push(`in ${gameResult}`);
  }

  allQueryFormatters.forEach((queryFormatter) => {
    const { key, includes, excludes, formatter } = queryFormatter;

    if (result[key]) {
      textArrayEntries.push(`${key} ${includes} ${formatter(result)}`);
    }
    if (result.exclude?.[key]) {
      textArrayEntries.push(`${key} ${excludes} ${formatter(result.exclude)}`);
    }
  });

  if (result['in']) {
    textArrayEntries.push(`in ${result['in']}`);
  }

  if (result['text']) {
    textArrayEntries.push(`"${result['text']}" is in name or card id`);
  }

  if (query.includes('game:')) {
    return `${cardText} ${textArrayEntries[0]} ${
      textArrayEntries.length > 1 ? 'where' : ''
    } ${textArrayEntries.slice(1).join(' and ')}`;
  }

  return `${cardText} ${
    textArrayEntries.length > 0 ? 'where' : ''
  } ${textArrayEntries.join(' and ')}`;
}

export function getGameFromQuery(query: string): string | undefined {
  query = (query ?? '').toLowerCase().trim();

  const validKeywords = [allKeywords].flat(2);

  const result = parser.parse(query, {
    keywords: validKeywords,
    offsets: false,
  });

  if (isString(result)) return undefined;

  return result['game'];
}

export function reformatQueryToJustHaveProduct(query: string): string {
  const product = getGameFromQuery(query);
  if (!product) return '';
  return `game:"${product}"`;
}

export function removeGameFromQuery(query: string) {
  return query.replaceAll(/\bgame:"?([\w,]+)"?/gm, '');
}

export function removeProductsFromQuery(query: string) {
  return query.replace(/\bproduct:"([\w,]+)"/gm, '');
}

export function removeTagsFromQuery(query: string) {
  return query.replace(/\btag:"([\w,]+)"/gm, '');
}

export function removeAllButBareTextAndGameFromQuery(
  query: string,
  extraOperators: Array<{ aliases: string[]; operator: ParserOperator }> = []
): string {
  query = query.toLowerCase().trim();

  const validKeywords = [allKeywords].flat(2);

  const result = parser.parse(query, {
    keywords: validKeywords,
    offsets: false,
    ...extraOperators.map((o) => o.aliases),
  });

  if (isString(result)) {
    return result;
  }

  return (result.text ?? '') as string;
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
