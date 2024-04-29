import { inject, Injectable, signal, type WritableSignal } from '@angular/core';
import { sortBy } from 'lodash';
import type { ICardFAQ, ICardFAQEntry } from '../../interfaces';
import { LocaleService } from './locale.service';
import { MetaService } from './meta.service';

@Injectable({
  providedIn: 'root',
})
export class FAQService {
  private metaService = inject(MetaService);
  private localeService = inject(LocaleService);

  private allFAQs: WritableSignal<
    Array<{
      productId: string;
      locale: string;
      url: string;
    }>
  > = signal([]);

  private faqByProductIdAndLocale: WritableSignal<
    Record<string, Record<string, ICardFAQ[]>>
  > = signal({});

  private faqByProductLocaleCard: WritableSignal<
    Record<string, Record<string, Record<string, ICardFAQEntry[]>>>
  > = signal({});

  public async init() {
    this.allFAQs.set(this.metaService.getAllFAQs());
    await this.loadLocaleFAQs();
  }

  private async loadLocaleFAQs() {
    const baseFAQs = this.faqByProductIdAndLocale();

    await Promise.all(
      this.allFAQs().map(async (faq) => {
        if (baseFAQs[faq.productId]?.[faq.locale]) return;

        baseFAQs[faq.productId] ??= {};

        const faqData = await fetch(faq.url);
        const realData = await faqData.json();

        baseFAQs[faq.productId][faq.locale] = sortBy(realData, 'card');

        this.faqByProductIdAndLocale.set({
          ...this.faqByProductIdAndLocale(),
          ...baseFAQs,
        });

        const faqByProductLocaleCard = this.faqByProductLocaleCard();

        realData.forEach((cardFAQ: ICardFAQ) => {
          faqByProductLocaleCard[faq.productId] ??= {};
          faqByProductLocaleCard[faq.productId][faq.locale] ??= {};
          faqByProductLocaleCard[faq.productId][faq.locale][cardFAQ.card] ??=
            cardFAQ.faq;
        });

        this.faqByProductLocaleCard.set(faqByProductLocaleCard);
      })
    );
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
