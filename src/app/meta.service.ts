import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { get } from 'lodash';
import type { IProduct, IProductFilter } from '../../interfaces';
import { environment } from '../environments/environment';
import { LocaleService } from './locale.service';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private http = inject(HttpClient);
  private localeService = inject(LocaleService);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private siteConfig: any = {};

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
    return (
      this.http
        .get(`${environment.baseUrl}/meta.json`)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .subscribe((realData: any) => {
          this.siteConfig = realData.config;

          this.allProducts = realData.products;

          this.localeService.setLocales(realData.locales);

          this.loadExternals();
        })
    );
  }

  private loadExternals() {
    this.allProducts.forEach((product) => {
      this.productNamesByProductId[product.id] = product.name;
      this.templatesByProductId[product.id] = product.cardTemplate;
      this.rulesByProductId[product.id] = product.external?.rules ?? '';
      this.filtersByProductId[product.id] = product.filters;

      product.subproducts.forEach((sub) => {
        this.productNamesByProductId[sub.id] = sub.name;
      });
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

  public getSiteConfigProperty(prop: string): string | undefined {
    return get(this.siteConfig, prop);
  }
}
