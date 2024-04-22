import { type ICard } from '../../interfaces';

export function bare(cards: ICard[], query: string, extraData = {}): ICard[] {
  const sQueries = query.toLowerCase().split(' ');

  const matches = (card: ICard, term: string) => {
    if (card.id.toLowerCase() === term) {
      return true;
    }

    if (card.name.toLowerCase().includes(term)) {
      return true;
    }

    return false;
  };

  const foundCards = cards.filter((card) => {
    const matchesAllSomewhere = sQueries.filter((sQuery) =>
      matches(card, sQuery)
    );
    return matchesAllSomewhere.length === sQueries.length;
  });

  return foundCards;
}
