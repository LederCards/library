import { Injectable } from '@angular/core';

import type { IProduct, IProductFilter } from '../../interfaces';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private allProducts: IProduct[] = [];
  private templatesByProductId: Record<string, string> = {};
  private rulesByProductId: Record<string, string> = {};
  private filtersByProductId: Record<string, IProductFilter[]> = {};

  public get products() {
    return this.allProducts;
  }

  public async init() {
    const metaData = await fetch(`${environment.baseUrl}/meta.json`);
    const realData = await metaData.json();

    this.allProducts = realData;

    this.loadExternals();
  }

  private loadExternals() {
    this.allProducts.forEach((product) => {
      this.templatesByProductId[product.id] = product.cardTemplate;
      this.rulesByProductId[product.id] = product.external.rules;
      this.filtersByProductId[product.id] = product.filters;
    });
  }

  public getTemplateByProductId(productId: string): string {
    return this.templatesByProductId[productId];
  }

  public getRulesByProductId(productId: string): string {
    return this.rulesByProductId[productId];
  }

  public getFiltersByProductId(productId: string): IProductFilter[] {
    return this.filtersByProductId[productId] ?? [];
  }

  public getAllFilters(): IProductFilter[] {
    return Object.values(this.filtersByProductId).flat();
  }
}
