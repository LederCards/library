import type * as parser from 'search-query-parser';
import { ICard, ICardHelp } from '../../interfaces';

// this operator lets you check if something is in your collection, or not in your collection
export function inOperator(aliases: string[]) {
  return (
    cards: ICard[],
    results: parser.SearchParserResult,
    extraData: any = {}
  ) => {
    // if we have no cards, short-circuit because we can't filter it anymore
    if (cards.length === 0) {
      return [];
    }

    // if this operator isn't present at all, we skip it
    const shouldFilterThisOperator = aliases.some(
      (alias) => results[alias] || results.exclude[alias]
    );
    if (!shouldFilterThisOperator) {
      return cards;
    }

    const collection = extraData.collection ?? {};

    // map all of the aliases (the same alias is an OR)
    return aliases
      .map((alias) => {
        // collection filtering
        if (results.exclude[alias] === 'collection') {
          return cards.filter((c) => !collection[c.id]);
        }

        if (results[alias] === 'collection') {
          return cards.filter((c) => collection[c.id]);
        }

        // if we have no results for this alias, we return no cards
        return [];
      })
      .flat();
  };
}

export const inC = inOperator(['in']);

export const inDescription: ICardHelp = {
  name: 'In',
  id: 'in',

  icon: 'archive-outline',

  color: '#36abe0',

  help: `
You can find cards that are either in or not in your collection by using the \`in:\` operator.

Presently, you can only specify \`collection\` as the value for this operator.

You can modify your collection by <a target="_blank" href="/login">logging in</a>
and then going to <a target="_blank" href="/collection">my collection</a>.
`,

  examples: [
    {
      example: '`in:collection`',
      explanation: 'Cards in your collection.',
    },
    {
      example: '`-in:collection`',
      explanation: 'Cards not in your collection.',
    },
  ],
};
