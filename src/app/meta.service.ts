import { computed, inject, Injectable, signal, type Signal, type WritableSignal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { get } from 'lodash';
import { of } from 'rxjs';
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
  private siteConfig: WritableSignal<Record<string, string | undefined>> = signal({});

  private allProducts: WritableSignal<IProduct[]> = signal([]);
  private groupByProductId<T>(getField: (product: IProduct) => T): Record<string, T> {
    return Object.fromEntries(this.allProducts().map(product => [product.id, getField(product)]))
  }

  private productNamesByProductId: Signal<Record<string, string>> = computed(
    () => ({
      ...this.groupByProductId(product => product.name),
      ...Object.fromEntries(this.allProducts().flatMap(product => product.subproducts.map(sub => [sub.id, sub.name]))),
    })
  );
  private templatesByProductId: Signal<Record<string, Record<string, string>>> = computed(
    () => this.groupByProductId(product => product.cardTemplate)
  );
  private rulesByProductId: Signal<Record<string, string>> = computed(
    () => this.groupByProductId(product => product.external?.rules ?? '')
  );
  private filtersByProductId: Signal<Record<string, IProductFilter[]>> = computed(
    () => this.groupByProductId(product => product.filters)
  );
  private faqByProductId: Signal<Record<string, Record<string, string>>> = computed(() => ({}));

  public get products() {
    return this.allProducts();
  }

  public init() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finishLoad = (realData: any) => {
      this.siteConfig.set(realData.config);
      this.allProducts.set(realData.products);
      this.localeService.setLocales(realData.locales);
    };

    if (environment.overrideData.meta) {
      finishLoad(environment.overrideData.meta);
      return of(true);
    }

    const obs = this.http.get(`${environment.baseUrl}/meta.json`);

    obs.subscribe((realData) => {
      finishLoad(realData);
    });

    return obs;
  }

  public getProductNameByProductId(productId: string): string {
    return this.productNamesByProductId()[productId] ?? "";
  }

  public getTemplateByProductId(productId: string): string {
    return this.templatesByProductId()[productId]?.[this.localeService.currentLocale()] ?? '';
  }

  public getRulesByProductId(productId: string): string {
    return this.rulesByProductId()[productId] ?? '';
  }

  public getFiltersByProductId(productId: string): IProductFilter[] {
    return this.filtersByProductId()[productId] ?? [];
  }

  public getFAQByProductId(productId: string): Record<string, string> {
    return this.faqByProductId()[productId] ?? {};
  }

  public getAllFilters(): IProductFilter[] {
    return Object.values(this.filtersByProductId()).flat();
  }

  public getSiteConfigProperty(prop: string): string | undefined {
    return get(this.siteConfig, prop);
  }
}
