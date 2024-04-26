import { effect, inject, Injectable, Injector, signal } from '@angular/core';
import type { ICardFAQ, ICardFAQEntry } from '../../interfaces';
import { LocaleService } from './locale.service';
import { MetaService } from './meta.service';

@Injectable({
  providedIn: 'root',
})
export class FAQService {
  private metaService = inject(MetaService);
  private localeService = inject(LocaleService);
  private injector = inject(Injector);

  private isReady = signal<boolean>(false);
  public ready$ = this.isReady.asReadonly();

  private allFAQs: Array<{
    productId: string;
    locale: string;
    url: string;
  }> = [];

  private faqByProductIdAndLocale: Record<string, Record<string, ICardFAQ[]>> =
    {};

  private faqByProductLocaleCard: Record<
    string,
    Record<string, Record<string, ICardFAQEntry[]>>
  > = {};

  public async init() {
    this.allFAQs = this.metaService.getAllFAQs();

    effect(
      () => {
        const locale = this.localeService.currentLocale();
        this.loadLocaleFAQs(locale);
      },
      { injector: this.injector, allowSignalWrites: true }
    );
  }

  private loadLocaleFAQs(locale: string) {
    this.allFAQs.forEach(async (faq) => {
      if (faq.locale !== locale) return;
      if (this.faqByProductIdAndLocale[faq.productId]?.[faq.locale]) return;

      this.faqByProductIdAndLocale[faq.productId] ??= {};

      const faqData = await fetch(faq.url);
      const realData = await faqData.json();

      this.faqByProductIdAndLocale[faq.productId][faq.locale] = realData;

      realData.forEach((cardFAQ: ICardFAQ) => {
        this.faqByProductLocaleCard[faq.productId] ??= {};
        this.faqByProductLocaleCard[faq.productId][faq.locale] ??= {};
        this.faqByProductLocaleCard[faq.productId][faq.locale][cardFAQ.card] ??=
          cardFAQ.faq;
      });
    });

    if (!this.isReady()) this.isReady.set(true);
  }

  public getCardFAQ(productId: string, card: string): ICardFAQEntry[] {
    return (
      this.faqByProductLocaleCard[productId]?.[
        this.localeService.currentLocale()
      ]?.[card] ?? []
    );
  }
}
