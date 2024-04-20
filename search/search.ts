
import * as parser from 'search-query-parser';
import { isString } from 'lodash';

import { ICard } from '../interfaces';

import { ability, attribute, bare, card, color, cost, expansion, flavor, inC, level,
  name, power, rarity, release, set, side, soul, tag, trigger, type } from './operators';

const allKeywords = [
  ['ability'],            // array search
  ['attribute',  'a'],    // array search
  ['id'],                 // exact text
  ['color',      'c'],    // exact text
  ['cost',       'co'],   // number search
  ['expansion',  'e'],    // loose text
  ['flavor',     'f'],    // loose text
  ['in'],                 // special operator
  ['level',      'l'],    // number search
  ['name',       'n'],    // loose text
  ['power',      'p'],    // number search
  ['rarity',     'r'],    // exact text
  ['release',    'rel'],  // exact text
  ['set'],                // exact text
  ['side'],               // exact text
  ['soul',       's'],    // number search
  ['tag'],                // array search
  ['type'],               // exact text
  ['trigger',    't']     // array search
];

const operators = [
  inC,

  ability,
  attribute,
  card,
  color,
  cost,
  expansion,
  flavor,
  level,
  name,
  power,
  rarity,
  release,
  set,
  side,
  soul,
  tag,
  trigger,
  type
];

export function properOperatorsInsteadOfAliases(result: parser.SearchParserResult): parser.SearchParserResult {
  allKeywords.forEach(keyword => {
    if(keyword.length === 1) {
      return;
    }

    keyword.slice(1).forEach(alias => {
      if(result[alias]) {
        result[keyword[0]] = result[alias];
        delete result[alias];
      }
      if(result.exclude[alias]) {
        result.exclude[keyword[0]] = result.exclude[alias];
        delete result.exclude[alias];
      }
    });
  });

  return result;
};

const allQueryFormatters = [
  {
    key: 'ability',
    includes: 'has',
    excludes: 'does not have',
    formatter: (result: Record<string, any>) => {
      const value = result.ability;
      const abilities: string[] = isString(value) ? [value] : value as unknown as string[];
      return `${abilities.map(x => `"${x}"`).join(' or ')}`;
    }
  },
  {
    key: 'attribute',
    includes: 'has',
    excludes: 'does not have',
    formatter: (result: Record<string, any>) => {
      const value = result.attribute;
      const attributes: string[] = isString(value) ? [value] : value as unknown as string[];
      return `${attributes.map(x => `"${x}"`).join(' or ')}`;
    }
  },
  {
    key: 'id',
    includes: 'is',
    excludes: 'is not',
    formatter: (result: Record<string, any>) => {
      const value = result.id;
      return `${value}`;
    }
  },
  {
    key: 'color',
    includes: 'is',
    excludes: 'is not',
    formatter: (result: Record<string, any>) => {
      const value = result.color;
      const colors: string[] = isString(value) ? [value] : value as unknown as string[];
      return `${colors.join(' or ')}`;
    }
  },
  {
    key: 'cost',
    includes: 'is',
    excludes: 'is not',
    formatter: (result: Record<string, any>) => {
      const value = result.cost;
      return `${value}`;
    }
  },
  {
    key: 'expansion',
    includes: 'has',
    excludes: 'does not have',
    formatter: (result: Record<string, any>) => {
      const value = result.expansion;
      const expansions: string[] = isString(value) ? [value] : value as unknown as string[];
      return `${expansions.map(x => `"${x}"`).join(' or ')}`;
    }
  },
  {
    key: 'flavor',
    includes: 'text contains',
    excludes: 'text does not contain',
    formatter: (result: Record<string, any>) => {
      const value = result.flavor;
      return `"${value}"`;
    }
  },
  {
    key: 'level',
    includes: 'is',
    excludes: 'is not',
    formatter: (result: Record<string, any>) => {
      const value = result.level;
      return `${value}`;
    }
  },
  {
    key: 'name',
    includes: 'contains',
    excludes: 'does not contain',
    formatter: (result: Record<string, any>) => {
      const value = result.name;
      return `"${value}"`;
    }
  },
  {
    key: 'power',
    includes: 'is',
    excludes: 'is not',
    formatter: (result: Record<string, any>) => {
      const value = result.power;
      return `${value}`;
    }
  },
  {
    key: 'rarity',
    includes: 'is',
    excludes: 'is not',
    formatter: (result: Record<string, any>) => {
      const value = result.rarity;
      const rarities: string[] = isString(value) ? [value] : value as unknown as string[];
      return `${rarities.map(x => `"${x}"`).join(' or ')}`;
    }
  },
  {
    key: 'release',
    includes: 'is',
    excludes: 'is not',
    formatter: (result: Record<string, any>) => {
      const value = result.release;
      const releases: string[] = isString(value) ? [value] : value as unknown as string[];
      return `${releases.map(x => `"${x}"`).join(' or ')}`;
    }
  },
  {
    key: 'set',
    includes: 'is',
    excludes: 'is not',
    formatter: (result: Record<string, any>) => {
      const value = result.set;
      return `${value}`;
    }
  },
  {
    key: 'side',
    includes: 'is',
    excludes: 'is not',
    formatter: (result: Record<string, any>) => {
      const value = result.side;
      return `${value}`;
    }
  },
  {
    key: 'soul',
    includes: 'is',
    excludes: 'is not',
    formatter: (result: Record<string, any>) => {
      const value = result.soul;
      return `${value}`;
    }
  },
  {
    key: 'tag',
    includes: 'has',
    excludes: 'does not have',
    formatter: (result: Record<string, any>) => {
      const value = result.tag;
      const tags: string[] = isString(value) ? [value] : value as unknown as string[];
      return `${tags.map(x => `"${x}"`).join(' or ')}`;
    }
  },
  {
    key: 'trigger',
    includes: 'has',
    excludes: 'does not have',
    formatter: (result: Record<string, any>) => {
      const value = result.trigger;
      const triggers: string[] = isString(value) ? [value] : value as unknown as string[];
      return `${triggers.map(x => `"${x}"`).join(' or ')}`;
    }
  },
  {
    key: 'type',
    includes: 'is',
    excludes: 'is not',
    formatter: (result: Record<string, any>) => {
      const value = result.type;
      return `${value}`;
    }
  },
];

export function queryToText(query: string): string {
  query = query.toLowerCase().trim();

  const firstResult = parser.parse(query, { keywords: allKeywords.flat(), offsets: false }) as parser.SearchParserResult;
  if(isString(firstResult)) {
    const queries = query.split(' ').map(x => `"${x}"`).join(' or ');
    return `cards with ${queries} in the name, abilities, expansion, or code`;
  }

  const result = properOperatorsInsteadOfAliases(firstResult);

  const text = [];

  allQueryFormatters.forEach(queryFormatter => {
    const { key, includes, excludes, formatter } = queryFormatter;

    if(result[key]) {
      text.push(`${key} ${includes} ${formatter(result)}`);
    }
    if(result.exclude[key]) {
      text.push(`${key} ${excludes} ${formatter(result.exclude)}`);
    }
  });

  if(result.in) {
    text.push(`in ${result.in}`);
  }

  return `cards where ${text.join(' and ')}`;
}

export function parseQuery(cards: ICard[], query: string, extraData = {}): ICard[] {
  query = query.toLowerCase().trim();

  const result = parser.parse(query, { keywords: allKeywords.flat(), offsets: false });

  // the parser returns a string if there's nothing interesting to do, for some reason
  // so we have a bare words parser
  if(isString(result)) {
    return bare(cards, query, extraData);
  }

  const resultText = (result as parser.SearchParserResult).text as string;

  let returnCards = cards;

  if(resultText) {
    returnCards = bare(returnCards, resultText, extraData);
  }

  // check all the operators
  operators.forEach(operator => {
    returnCards = operator(returnCards, result as parser.SearchParserResult, extraData);
  });

  return returnCards;
}
