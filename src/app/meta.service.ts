import { Injectable } from '@angular/core';

import type { IProduct } from '../../interfaces';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private allProducts: IProduct[] = [];

  public get products() {
    return this.allProducts;
  }

  public async init() {
    const metaData = await fetch(`${environment.baseUrl}/meta.json`);
    const realData = await metaData.json();

    this.allProducts = realData;
  }
}
