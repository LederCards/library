import {
  effect,
  inject,
  Injectable,
  Injector,
  signal,
  type WritableSignal,
} from '@angular/core';
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

  private faqByProductLocaleCard: Record<
    string,
    Record<string, Record<string, ICardFAQEntry[]>>
  > = {};

  public async init() {
    this.allFAQs.set(this.metaService.getAllFAQs());

    effect(
      () => {
        const locale = this.localeService.currentLocale();
        this.loadLocaleFAQs(locale);
      },
      { injector: this.injector, allowSignalWrites: true }
    );
  }

  private loadLocaleFAQs(locale: string) {
    const baseFAQs = this.faqByProductIdAndLocale();

    this.allFAQs().forEach(async (faq) => {
      if (faq.locale !== locale) return;
      if (baseFAQs[faq.productId]?.[faq.locale]) return;

      baseFAQs[faq.productId] ??= {};

      const faqData = await fetch(faq.url);
      const realData = await faqData.json();

      baseFAQs[faq.productId][faq.locale] = realData;

      this.faqByProductIdAndLocale.set({
        ...this.faqByProductIdAndLocale(),
        ...baseFAQs,
      });

      realData.forEach((cardFAQ: ICardFAQ) => {
        this.faqByProductLocaleCard[faq.productId] ??= {};
        this.faqByProductLocaleCard[faq.productId][faq.locale] ??= {};
        this.faqByProductLocaleCard[faq.productId][faq.locale][cardFAQ.card] ??=
          cardFAQ.faq;
      });
    });

    if (!this.isReady()) this.isReady.set(true);
  }

  public getFAQs(): Array<{
    productId: string;
    locale: string;
    faq: ICardFAQ[];
  }> {
    if (!this.isReady()) return [];

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
    return (
      this.faqByProductLocaleCard[productId]?.[
        this.localeService.currentLocale()
      ]?.[card] ?? []
    );
  }
}
