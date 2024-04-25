import { inject, Injectable } from '@angular/core';

import { decompress } from 'compress-json';
import { sortBy } from 'lodash';

import { type ICard, type IProductFilter } from '../../interfaces';
import { numericalOperator } from '../../search/operators/_helpers';
import { parseQuery, type ParserOperator } from '../../search/search';
import { environment } from '../environments/environment';
import { MetaService } from './meta.service';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private cards: ICard[] = [];
  private cardsByName: Record<string, ICard> = {};
  private cardsById: Record<string, ICard> = {};

  private metaService = inject(MetaService);

  public async init() {
    const cardData = await fetch(`${environment.baseUrl}/cards.min.json`);
    const realData = await cardData.json();

    const allCards = decompress(realData);
    this.setCards(allCards);
  }

  private setCards(cards: ICard[]) {
    this.cards = cards;

    this.cards.forEach((card) => {
      this.cardsByName[card.name] = card;
      this.cardsById[card.id] = card;
    });
  }

  // card utilities
  public getCardByIdOrName(codeOrName: string): ICard | undefined {
    return (
      this.cardsById[codeOrName] ?? this.cardsByName[codeOrName] ?? undefined
    );
  }

  public searchCards(query: string): ICard[] {
    const extraFilters = this.metaService.getAllFilters();
    const extraFilterOperators = extraFilters.map((filter) => {
      const mapped: Record<
        IProductFilter['type'],
        (f: IProductFilter) => ParserOperator
      > = {
        number: (f: IProductFilter) => {
          return numericalOperator(
            [filter.prop],
            `meta.${f.prop}` as keyof ICard
          );
        },
      };

      return { operator: mapped[filter.type](filter), aliases: [filter.prop] };
    });

    return parseQuery(this.cards, query, extraFilterOperators);
  }

  public getCardById(id: string): ICard | undefined {
    return this.cards.find((c) => c.id === id);
  }

  public getAllUniqueAttributes(attribute: keyof ICard): string[] {
    return sortBy(
      Array.from(new Set(this.cards.map((c) => c[attribute]).flat())),
      (x) => x?.toString().toLowerCase()
    ) as string[];
  }
}
