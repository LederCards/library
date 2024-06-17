import { inject, Injectable, signal, type WritableSignal } from '@angular/core';
import { sortBy } from 'lodash';
import type { ICardErrata, ICardErrataEntry } from '../../interfaces';
import { environment } from '../environments/environment';
import { LocaleService } from './locale.service';

@Injectable({
  providedIn: 'root',
})
export class ErrataService {
  private localeService = inject(LocaleService);

  private errataByProductIdAndLocale: WritableSignal<
    Record<string, Record<string, ICardErrata[]>>
  > = signal({});

  private errataByProductLocaleCard: WritableSignal<
    Record<string, Record<string, Record<string, ICardErrataEntry[]>>>
  > = signal({});

  public async init() {
    const errataData = await fetch(`${environment.baseUrl}/errata.json`);
    const realData = await errataData.json();

    this.parseLocaleErrata(realData);
  }

  private parseLocaleErrata(
    errataData: Record<string, Record<string, ICardErrata[]>>
  ) {
    const baseErrata = this.errataByProductIdAndLocale();
    const faqByProductLocaleCard = this.errataByProductLocaleCard();

    Object.keys(errataData).forEach((productId) => {
      baseErrata[productId] ??= {};

      Object.keys(errataData[productId]).forEach((locale) => {
        baseErrata[productId][locale] = sortBy(
          errataData[productId][locale],
          'card'
        );

        errataData[productId][locale].forEach((cardErrata) => {
          faqByProductLocaleCard[productId] ??= {};
          faqByProductLocaleCard[productId][locale] ??= {};
          faqByProductLocaleCard[productId][locale][cardErrata.card] ??=
            cardErrata.errata;
        });
      });
    });

    this.errataByProductIdAndLocale.set(baseErrata);
    this.errataByProductLocaleCard.set(faqByProductLocaleCard);
  }

  public getErrata(): Array<{
    productId: string;
    locale: string;
    errata: ICardErrata[];
  }> {
    const errataData = this.errataByProductIdAndLocale();
    const locale = this.localeService.currentLocale();

    return Object.keys(errataData)
      .map((productId) => ({
        productId,
        locale,
        errata: errataData[productId][locale],
      }))
      .filter((p) => p.errata)
      .flat();
  }

  public getProductErrata(
    productId: string,
    locale: string
  ): ICardErrata[] | undefined {
    const errata = this.errataByProductIdAndLocale();
    return errata?.[productId]?.[locale];
  }

  public getCardErrata(productId: string, card: string): ICardErrataEntry[] {
    const errata = this.errataByProductLocaleCard();
    const locale = this.localeService.currentLocale();

    return errata[productId]?.[locale]?.[card] ?? [];
  }
}
