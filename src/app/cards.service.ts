import { Injectable } from '@angular/core';

import { decompress } from 'compress-json';
import { sample, sortBy } from 'lodash';

import { ICard } from '../../interfaces';
import { parseQuery } from '../../search/search';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private cards: ICard[];
  private cardsByName: Record<string, ICard> = {};
  private cardsByCode: Record<string, ICard> = {};

  private collection: Record<string, number> = {};

  public get cardCollection() {
    return this.collection;
  }

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
      this.cardsByCode[card.id] = card;
    });
  }

  // external links
  public tcgPlayerLink(card: ICard) {
    return '';
  }

  // card utilities
  public getCardByCodeOrName(codeOrName: string): ICard | undefined {
    return (
      this.cardsByCode[codeOrName] ?? this.cardsByName[codeOrName] ?? undefined
    );
  }

  public searchCards(query: string): ICard[] {
    return parseQuery(this.cards, query, { collection: this.cardCollection });
  }

  public getCardById(id: string): ICard | undefined {
    return this.cards.find((c) => c.id === id);
  }

  public getRandomCard(): ICard {
    return sample(this.cards);
  }

  public getAllUniqueAttributes(attribute: keyof ICard): string[] {
    return sortBy(
      Array.from(new Set(this.cards.map((c) => c[attribute]).flat())),
      (x) => x.toString().toLowerCase()
    ) as string[];
  }
}
