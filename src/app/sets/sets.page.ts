import { Component, inject, type OnInit } from '@angular/core';
import { sortBy } from 'lodash';
import { type IProduct } from '../../../interfaces';
import { MetaService } from '../meta.service';

@Component({
  selector: 'app-sets',
  templateUrl: './sets.page.html',
  styleUrls: ['./sets.page.scss'],
})
export class SetsPage implements OnInit {
  private meta = inject(MetaService);

  public allProducts: IProduct[] = [];

  async ngOnInit() {
    this.allProducts = sortBy(this.meta.products, (p) => p.name);
  }

  formatSetNameForSearch(productId: string, subproductId?: string): string {
    if (!subproductId) {
      return `game:"${productId}"`;
    }

    return `game:"${productId}" product:"${subproductId}"`;
  }
}
