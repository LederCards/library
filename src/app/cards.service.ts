import { computed, inject, Injectable, signal, type Signal, type WritableSignal } from '@angular/core';

import { decompress } from 'compress-json';
import { sortBy } from 'lodash';

import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import type { ICard, IProductFilter } from '../../interfaces';
import { numericalOperator } from '../../search/operators/_helpers';
import { parseQuery, type ParserOperator } from '../../search/search';
import { environment } from '../environments/environment';
import { ErrataService } from './errata.service';
import { FAQService } from './faq.service';
import { LocaleService } from './locale.service';
import { MetaService } from './meta.service';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private cards: WritableSignal<ICard[] | null> = signal(null);
  private cardsByName: Signal<Record<string, ICard>> = computed(
    () => Object.fromEntries((this.allCards).map(card => [card.name, card]))
  );
  private cardsById: Signal<Record<string, ICard>> = computed(
    () => Object.fromEntries((this.allCards).map(card => [card.id, card]))
  );

  private http = inject(HttpClient);
  private localeService = inject(LocaleService);
  private metaService = inject(MetaService);
  private faqService = inject(FAQService);
  private errataService = inject(ErrataService);

  public get allCards(): ICard[] {
    return this.cards() ?? [];
  }

  // Returns true if the service has finished the initial fetch of card data.
  public get loaded(): boolean {
    return this.cards() !== null
  }

  public init() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finishLoad = (realData: any) => {
      const allCards = decompress(realData);
      this.cards.set(allCards)
    };

    if (environment.overrideData.cardsMin) {
      finishLoad(environment.overrideData.cardsMin);
      return of(true);
    }

    const obs = this.http.get(`${environment.baseUrl}/cards.min.json`);

    obs.subscribe((realData) => {
      finishLoad(realData);
    });

    return obs;
  }


  // card utilities
  private reformatCardsWithErrataAndFAQ: Signal<ICard[]> = computed(() => this.allCards.map(card => ({
    ...card,
    faq: this.faqService.getCardFAQ(card.game, card).length ?? 0,
    errata:
      this.errataService.getCardErrata(card.game, card.name).length ?? 0,
  })))

  public getCardByIdOrName(codeOrName: string): ICard | undefined {
    return (
      this.cardsById()[codeOrName] ?? this.cardsByName()[codeOrName] ?? undefined
    );
  }

  public searchCards(query: string): ICard[] {
    const formattedCards = this.reformatCardsWithErrataAndFAQ();
    return parseQuery(formattedCards, query, this.getExtraFilterOperators());
  }

  public getExtraFilterOperators() {
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

    return extraFilterOperators;
  }

  public getCardById(id: string): ICard | undefined {
    return this.allCards.find(
      (c) =>
        c.id.toLowerCase() === id.toLowerCase() &&
        c.locale === this.localeService.currentLocale()
    );
  }

  public getAllUniqueAttributes(attribute: keyof ICard): string[] {
    return sortBy(
      Array.from(new Set(this.allCards.map((c) => c[attribute]).flat())),
      (x) => x?.toString().toLowerCase()
    ) as string[];
  }
}
