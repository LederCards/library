import { inject, Injectable } from '@angular/core';

import type { IProduct, IProductFilter } from '../../interfaces';
import { environment } from '../environments/environment';
import { LocaleService } from './locale.service';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private localeService = inject(LocaleService);

  private allProducts: IProduct[] = [];

  private productNamesByProductId: Record<string, string> = {};
  private templatesByProductId: Record<string, Record<string, string>> = {};
  private rulesByProductId: Record<string, string> = {};
  private filtersByProductId: Record<string, IProductFilter[]> = {};
  private faqByProductId: Record<string, Record<string, string>> = {};

  public get products() {
    return this.allProducts;
  }

  public async init() {
    const metaData = await fetch(`${environment.baseUrl}/meta.json`);
    const realData = await metaData.json();

    this.allProducts = realData.products;

    this.localeService.setLocales(realData.locales);

    this.loadExternals();
  }

  private loadExternals() {
    this.allProducts.forEach((product) => {
      this.productNamesByProductId[product.id] = product.name;
      this.templatesByProductId[product.id] = product.cardTemplate;
      this.rulesByProductId[product.id] = product.external?.rules ?? '';
      this.filtersByProductId[product.id] = product.filters;
      this.faqByProductId[product.id] = product.external?.faq ?? {};
    });
  }

  public getProductNameByProductId(productId: string): string {
    return this.productNamesByProductId[productId];
  }

  public getTemplateByProductId(productId: string): string {
    return this.templatesByProductId[productId][
      this.localeService.currentLocale()
    ];
  }

  public getRulesByProductId(productId: string): string {
    return this.rulesByProductId[productId];
  }

  public getFiltersByProductId(productId: string): IProductFilter[] {
    return this.filtersByProductId[productId] ?? [];
  }

  public getFAQByProductId(productId: string): Record<string, string> {
    return this.faqByProductId[productId] ?? {};
  }

  public getAllFilters(): IProductFilter[] {
    return Object.values(this.filtersByProductId).flat();
  }

  public getAllFAQs(): Array<{
    productId: string;
    locale: string;
    url: string;
  }> {
    return Object.keys(this.faqByProductId)
      .map((productId) =>
        Object.keys(this.faqByProductId[productId]).map((locale) => ({
          productId,
          locale,
          url: this.faqByProductId[productId][locale],
        }))
      )
      .flat();
  }
}
