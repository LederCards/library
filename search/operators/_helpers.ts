import { isArray } from 'lodash';
import type * as parser from 'search-query-parser';

import { type ICard } from '../../interfaces';

function getValueFromCard<T>(card: ICard, prop: keyof ICard): T {
  return card[prop] as T;
}

function cardMatchesNumberCheck(value: number, numberCheck: string): boolean {
  if (numberCheck.includes('<=')) {
    return value <= +numberCheck.replace('<=', '').trim();
  }

  if (numberCheck.includes('>=')) {
    return value >= +numberCheck.replace('>=', '').trim();
  }

  if (numberCheck.includes('>')) {
    return value > +numberCheck.replace('>', '').trim();
  }

  if (numberCheck.includes('<')) {
    return value < +numberCheck.replace('<', '').trim();
  }

  if (numberCheck.includes('!=')) {
    return value !== +numberCheck.replace('!=', '').trim();
  }

  if (numberCheck.includes('=')) {
    return value === +numberCheck.replace('=', '').trim();
  }

  return value === +numberCheck;
}

// this operator works on number fields
// it supports exact matching, as well as >, >=, <, <=
export function numericalOperator(aliases: string[], key: keyof ICard) {
  return (
    cards: ICard[],
    results: parser.SearchParserResult,
    extraData = {}
  ) => {
    // if we have no cards, short-circuit because we can't filter it anymore
    if (cards.length === 0) {
      return [];
    }

    // if this operator isn't present at all, we skip it
    const shouldFilterThisOperator = aliases.some(
      (alias) => results[alias] || results.exclude?.[alias]
    );
    if (!shouldFilterThisOperator) {
      return cards;
    }

    // map all of the aliases (the same alias is an OR)
    return aliases
      .map((alias) => {
        // if we have an exclusion rule for the alias (-alias), we ignore those cards
        if (results.exclude?.[alias]) {
          const search = isArray(results.exclude[alias])
            ? results.exclude[alias]
            : [results.exclude[alias]];
          return cards.filter((c) =>
            search.every(
              (i: string) =>
                !cardMatchesNumberCheck(getValueFromCard<number>(c, key), i)
            )
          );
        }

        // otherwise we treat it as inclusion, and get those cards
        if (results[alias]) {
          const search = isArray(results[alias])
            ? results[alias]
            : [results[alias]];
          return cards.filter((c) =>
            search.some((i: string) =>
              cardMatchesNumberCheck(getValueFromCard<number>(c, key), i)
            )
          );
        }

        // if we have no results for this alias, we return no cards
        return [];
      })
      .flat();
  };
}

// this operator works on equal text matches, but the subproperty is an array
// it also checks case-insensitively
// it also supports "none" as a value for empty arrays
export function arraySearchOperator(aliases: string[], key: keyof ICard) {
  return (
    cards: ICard[],
    results: parser.SearchParserResult,
    extraData = {}
  ) => {
    // if we have no cards, short-circuit because we can't filter it anymore
    if (cards.length === 0) {
      return [];
    }

    // if this operator isn't present at all, we skip it
    const shouldFilterThisOperator = aliases.some(
      (alias) => results[alias] || results.exclude?.[alias]
    );
    if (!shouldFilterThisOperator) {
      return cards;
    }

    // map all of the aliases (the same alias is an OR)
    return aliases
      .map((alias) => {
        // if we have an exclusion rule for the alias (-alias), we ignore those cards
        if (results.exclude?.[alias]) {
          const search = isArray(results.exclude[alias])
            ? results.exclude[alias]
            : [results.exclude[alias]];
          const invalidItems = search.map((x: string) => x.toLowerCase());
          return cards.filter(
            (c) =>
              !invalidItems.some((i: string) => {
                const arr = getValueFromCard<string[]>(c, key);

                if (i === 'none') {
                  return arr.length === 0;
                }

                const innerSearches = arr.map((x) => x.toLowerCase());
                return innerSearches.some((x) =>
                  x.toLowerCase().includes(i.toLowerCase())
                );
              })
          );
        }

        // otherwise we treat it as inclusion, and get those cards
        if (results[alias]) {
          const search = isArray(results[alias])
            ? results[alias]
            : [results[alias]];
          const validItems = search.map((x: string) => x.toLowerCase());
          return cards.filter((c) =>
            validItems.some((i: string) => {
              const arr = getValueFromCard<string[]>(c, key);

              if (i === 'none') {
                return arr.length === 0;
              }

              const innerSearches = arr.map((x) => x.toLowerCase());
              return innerSearches.some((x) =>
                x.toLowerCase().includes(i.toLowerCase())
              );
            })
          );
        }

        // if we have no results for this alias, we return no cards
        return [];
      })
      .flat();
  };
}

// this operator works on loose text matching for a field
// some properties will prefer to use this for shorthand reasons
// it also checks case-insensitively
export function partialWithOptionalExactTextOperator(
  aliases: string[],
  key: keyof ICard
) {
  return (
    cards: ICard[],
    results: parser.SearchParserResult,
    extraData = {}
  ) => {
    // if we have no cards, short-circuit because we can't filter it anymore
    if (cards.length === 0) {
      return [];
    }

    // if this operator isn't present at all, we skip it
    const shouldFilterThisOperator = aliases.some(
      (alias) => results[alias] || results.exclude?.[alias]
    );
    if (!shouldFilterThisOperator) {
      return cards;
    }

    // map all of the aliases (the same alias is an OR)
    return aliases
      .map((alias) => {
        // if we have an exclusion rule for the alias (-alias), we ignore those cards
        if (results.exclude?.[alias]) {
          const search = isArray(results.exclude[alias])
            ? results.exclude[alias]
            : [results.exclude[alias]];
          const invalidItems = search.map((x: string) => x.toLowerCase());
          return cards.filter(
            (c) =>
              !invalidItems.some((i: string) => {
                const isExact = i.startsWith('=');
                const searchString = isExact ? i.replace('=', '') : i;

                const val = getValueFromCard<string>(c, key);

                if (isExact) {
                  return val.toLowerCase() === searchString;
                }

                return val.toLowerCase().includes(i);
              })
          );
        }

        // otherwise we treat it as inclusion, and get those cards
        if (results[alias]) {
          const search = isArray(results[alias])
            ? results[alias]
            : [results[alias]];
          const validItems = search.map((x: string) => x.toLowerCase());
          return cards.filter((c) =>
            validItems.some((i: string) => {
              const isExact = i.startsWith('=');
              const searchString = isExact ? i.replace('=', '') : i;

              const val = getValueFromCard<string>(c, key);

              if (isExact) {
                return val.toLowerCase() === searchString;
              }

              return val.toLowerCase().includes(i);
            })
          );
        }

        // if we have no results for this alias, we return no cards
        return [];
      })
      .flat();
  };
}

// this operator works on exact text matching for a field
// most properties can use this sufficiently
// it still checks case-insensitively
export function exactTextOperator(aliases: string[], key: keyof ICard) {
  return (
    cards: ICard[],
    results: parser.SearchParserResult,
    extraData = {}
  ) => {
    // if we have no cards, short-circuit because we can't filter it anymore
    if (cards.length === 0) {
      return [];
    }

    // if this operator isn't present at all, we skip it
    const shouldFilterThisOperator = aliases.some(
      (alias) => results[alias] || results.exclude?.[alias]
    );
    if (!shouldFilterThisOperator) {
      return cards;
    }

    // map all of the aliases (the same alias is an OR)
    return aliases
      .map((alias) => {
        // if we have an exclusion rule for the alias (-alias), we ignore those cards
        if (results.exclude?.[alias]) {
          const search = isArray(results.exclude[alias])
            ? results.exclude[alias]
            : [results.exclude[alias]];
          const invalidItems = search.map((x: string) => x.toLowerCase());
          return cards.filter(
            (c) =>
              !invalidItems.includes(
                getValueFromCard<string>(c, key).toLowerCase()
              )
          );
        }

        // otherwise we treat it as inclusion, and get those cards
        if (results[alias]) {
          const search = isArray(results[alias])
            ? results[alias]
            : [results[alias]];
          const validItems = search.map((x: string) => x.toLowerCase());
          return cards.filter((c) =>
            validItems.includes(getValueFromCard<string>(c, key).toLowerCase())
          );
        }

        // if we have no results for this alias, we return no cards
        return [];
      })
      .flat();
  };
}
