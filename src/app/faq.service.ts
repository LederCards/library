import { inject, Injectable, signal, type WritableSignal } from '@angular/core';
import { sortBy } from 'lodash';
import type { ICardFAQ, ICardFAQEntry } from '../../interfaces';
import { environment } from '../environments/environment';
import { LocaleService } from './locale.service';

@Injectable({
  providedIn: 'root',
})
export class FAQService {
  private localeService = inject(LocaleService);

  private faqByProductIdAndLocale: WritableSignal<
    Record<string, Record<string, ICardFAQ[]>>
  > = signal({});

  private faqByProductLocaleCard: WritableSignal<
    Record<string, Record<string, Record<string, ICardFAQEntry[]>>>
  > = signal({});

  public async init() {
    const faqData = await fetch(`${environment.baseUrl}/faq.json`);
    const realData = await faqData.json();

    this.parseLocaleFAQs(realData);
  }

  private parseLocaleFAQs(faqData: Record<string, Record<string, ICardFAQ[]>>) {
    const baseFAQs = this.faqByProductIdAndLocale();
    const faqByProductLocaleCard = this.faqByProductLocaleCard();

    Object.keys(faqData).forEach((productId) => {
      baseFAQs[productId] ??= {};

      Object.keys(faqData[productId]).forEach((locale) => {
        baseFAQs[productId][locale] = sortBy(
          faqData[productId][locale],
          'card'
        );

        faqData[productId][locale].forEach((cardFAQ) => {
          faqByProductLocaleCard[productId] ??= {};
          faqByProductLocaleCard[productId][locale] ??= {};
          faqByProductLocaleCard[productId][locale][cardFAQ.card] ??=
            cardFAQ.faq;
        });
      });
    });

    this.faqByProductIdAndLocale.set(baseFAQs);
    this.faqByProductLocaleCard.set(faqByProductLocaleCard);

    console.log(baseFAQs, faqByProductLocaleCard);
  }

  public getFAQs(): Array<{
    productId: string;
    locale: string;
    faq: ICardFAQ[];
  }> {
    const faqData = this.faqByProductIdAndLocale();
    const locale = this.localeService.currentLocale();

    return Object.keys(faqData)
      .map((productId) => ({
        productId,
        locale,
        faq: faqData[productId][locale],
      }))
      .filter((p) => p.faq)
      .flat();
  }

  public getProductFAQ(
    productId: string,
    locale: string
  ): ICardFAQ[] | undefined {
    const faq = this.faqByProductIdAndLocale();
    return faq?.[productId]?.[locale];
  }

  public getCardFAQ(productId: string, card: string): ICardFAQEntry[] {
    const faq = this.faqByProductLocaleCard();
    const locale = this.localeService.currentLocale();

    return faq[productId]?.[locale]?.[card] ?? [];
  }
}
