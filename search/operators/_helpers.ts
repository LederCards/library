
import { isArray } from 'lodash';
import type * as parser from 'search-query-parser';

import { ICard } from '../../interfaces';

function cardMatchesNumberCheck(value: number, numberCheck: string): boolean {

  if(numberCheck.includes('<=')) {
    return value <= +numberCheck.replace('<=', '').trim();
  }

  if(numberCheck.includes('>=')) {
    return value >= +numberCheck.replace('>=', '').trim();
  }

  if(numberCheck.includes('>')) {
    return value > +numberCheck.replace('>', '').trim();
  }

  if(numberCheck.includes('<')) {
    return value < +numberCheck.replace('<', '').trim();
  }

  if(numberCheck.includes('!=')) {
    return value !== +numberCheck.replace('!=', '').trim();
  }

  if(numberCheck.includes('=')) {
    return value === +numberCheck.replace('=', '').trim();
  }

  return value === +numberCheck;
}

// this operator works on number fields
// it supports exact matching, as well as >, >=, <, <=
export function numericalOperator(aliases: string[], key: string) {
  return (cards: ICard[], results: parser.SearchParserResult, extraData = {}) => {

    // if we have no cards, short-circuit because we can't filter it anymore
    if(cards.length === 0) {
      return [];
    }

    // if this operator isn't present at all, we skip it
    const shouldFilterThisOperator = aliases.some(alias => results[alias] || results.exclude[alias]);
    if(!shouldFilterThisOperator) {
      return cards;
    }

    // map all of the aliases (the same alias is an OR)
    return aliases.map(alias => {

      // if we have an exclusion rule for the alias (-alias), we ignore those cards
      if(results.exclude[alias]) {
        const search = isArray(results.exclude[alias]) ? results.exclude[alias] : [results.exclude[alias]];
        return cards.filter(c => search.every(i => !cardMatchesNumberCheck(c[key], i)));
      }

      // otherwise we treat it as inclusion, and get those cards
      if(results[alias]) {
        const search = isArray(results[alias]) ? results[alias] : [results[alias]];
        return cards.filter(c => search.some(i => cardMatchesNumberCheck(c[key], i)));
      }

      // if we have no results for this alias, we return no cards
      return [];

    }).flat();
  };
}

// this operator works on equal text matches, but the subproperty is an array
// it also checks case-insensitively
// it also supports "none" as a value for empty arrays
export function arraySearchOperator(aliases: string[], key: string) {
  return (cards: ICard[], results: parser.SearchParserResult, extraData = {}) => {

    // if we have no cards, short-circuit because we can't filter it anymore
    if(cards.length === 0) {
      return [];
    }

    // if this operator isn't present at all, we skip it
    const shouldFilterThisOperator = aliases.some(alias => results[alias] || results.exclude[alias]);
    if(!shouldFilterThisOperator) {
      return cards;
    }

    // map all of the aliases (the same alias is an OR)
    return aliases.map(alias => {

      // if we have an exclusion rule for the alias (-alias), we ignore those cards
      if(results.exclude[alias]) {
        const search = isArray(results.exclude[alias]) ? results.exclude[alias] : [results.exclude[alias]];
        const invalidItems = search.map(x => x.toLowerCase());
        return cards.filter(c => !invalidItems.some(i => {
          if(i === 'none') {
            return c[key].length === 0;
          }

          const innerSearches = c[key].map(x => x.toLowerCase());
          return innerSearches.some(x => x.toLowerCase().includes(i.toLowerCase()));
        }));
      }

      // otherwise we treat it as inclusion, and get those cards
      if(results[alias]) {
        const search = isArray(results[alias]) ? results[alias] : [results[alias]];
        const validItems = search.map(x => x.toLowerCase());
        return cards.filter(c => validItems.some(i => {
          if(i === 'none') {
            return c[key].length === 0;
          }

          const innerSearches = c[key].map(x => x.toLowerCase());
          return innerSearches.some(x => x.toLowerCase().includes(i.toLowerCase()));
        }));
      }

      // if we have no results for this alias, we return no cards
      return [];

    }).flat();
  };
}

// this operator works on loose text matching for a field
// some properties will prefer to use this for shorthand reasons
// it also checks case-insensitively
export function partialWithOptionalExactTextOperator(aliases: string[], key: string) {
  return (cards: ICard[], results: parser.SearchParserResult, extraData = {}) => {

    // if we have no cards, short-circuit because we can't filter it anymore
    if(cards.length === 0) {
      return [];
    }

    // if this operator isn't present at all, we skip it
    const shouldFilterThisOperator = aliases.some(alias => results[alias] || results.exclude[alias]);
    if(!shouldFilterThisOperator) {
      return cards;
    }

    // map all of the aliases (the same alias is an OR)
    return aliases.map(alias => {

      // if we have an exclusion rule for the alias (-alias), we ignore those cards
      if(results.exclude[alias]) {
        const search = isArray(results.exclude[alias]) ? results.exclude[alias] : [results.exclude[alias]];
        const invalidItems = search.map(x => x.toLowerCase());
        return cards.filter(c => !invalidItems.some(i => {
          const isExact = i.startsWith('=');
          const searchString = isExact ? i.replace('=', '') : i;

          if(isExact) {
            return c[key].toLowerCase() === searchString;
          }

          return c[key].toLowerCase().includes(i);
        }));
      }

      // otherwise we treat it as inclusion, and get those cards
      if(results[alias]) {
        const search = isArray(results[alias]) ? results[alias] : [results[alias]];
        const validItems = search.map(x => x.toLowerCase());
        return cards.filter(c => validItems.some(i => {
          const isExact = i.startsWith('=');
          const searchString = isExact ? i.replace('=', '') : i;

          if(isExact) {
            return c[key].toLowerCase() === searchString;
          }

          return c[key].toLowerCase().includes(i);
        }));
      }

      // if we have no results for this alias, we return no cards
      return [];

    }).flat();
  };
}

// this operator works on exact text matching for a field
// most properties can use this sufficiently
// it still checks case-insensitively
export function exactTextOperator(aliases: string[], key: string) {
  return (cards: ICard[], results: parser.SearchParserResult, extraData = {}) => {

    // if we have no cards, short-circuit because we can't filter it anymore
    if(cards.length === 0) {
      return [];
    }

    // if this operator isn't present at all, we skip it
    const shouldFilterThisOperator = aliases.some(alias => results[alias] || results.exclude[alias]);
    if(!shouldFilterThisOperator) {
      return cards;
    }

    // map all of the aliases (the same alias is an OR)
    return aliases.map(alias => {

      // if we have an exclusion rule for the alias (-alias), we ignore those cards
      if(results.exclude[alias]) {
        const search = isArray(results.exclude[alias]) ? results.exclude[alias] : [results.exclude[alias]];
        const invalidItems = search.map(x => x.toLowerCase());
        return cards.filter(c => !invalidItems.includes(c[key].toLowerCase()));
      }

      // otherwise we treat it as inclusion, and get those cards
      if(results[alias]) {
        const search = isArray(results[alias]) ? results[alias] : [results[alias]];
        const validItems = search.map(x => x.toLowerCase());
        return cards.filter(c => validItems.includes(c[key].toLowerCase()));
      }

      // if we have no results for this alias, we return no cards
      return [];

    }).flat();
  };
}
