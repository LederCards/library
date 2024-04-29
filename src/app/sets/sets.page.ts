import { HttpClient } from '@angular/common/http';
import { Component, inject, type OnInit } from '@angular/core';
import { sortBy } from 'lodash';
import { type IProduct } from '../../../interfaces';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-sets',
  templateUrl: './sets.page.html',
  styleUrls: ['./sets.page.scss'],
})
export class SetsPage implements OnInit {
  private http = inject(HttpClient);

  public allProducts: IProduct[] = [];

  async ngOnInit() {
    this.http
      .get(`${environment.baseUrl}/meta.json`)
      .subscribe((products: unknown) => {
        this.allProducts = sortBy(products as IProduct[], (p) => p.name);
      });
  }

  formatSetNameForSearch(productId: string, subproductId?: string): string {
    if (!subproductId) {
      return `product:"${productId}"`;
    }

    return `product:"${productId}" subproduct:"${subproductId}"`;
  }
}
