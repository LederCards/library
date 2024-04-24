import { Injectable } from '@angular/core';

import type { IProduct } from '../../interfaces';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private allProducts: IProduct[] = [];
  private templatesByProductId: Record<string, string> = {};
  private rulesByProductId: Record<string, string> = {};

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
    });
  }

  public getTemplateByProductId(productId: string): string {
    return this.templatesByProductId[productId];
  }

  public getRulesByProductId(productId: string): string {
    return this.rulesByProductId[productId];
  }
}
