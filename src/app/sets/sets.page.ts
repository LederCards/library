import { HttpClient } from '@angular/common/http';
import { Component, inject, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { sortBy } from 'lodash';
import { type IProduct } from '../../../interfaces';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-sets',
  templateUrl: './sets.page.html',
  styleUrls: ['./sets.page.scss'],
})
export class SetsPage implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);

  public allProducts: IProduct[] = [];

  async ngOnInit() {
    this.http
      .get(`${environment.baseUrl}/meta.json`)
      .subscribe((products: unknown) => {
        this.allProducts = sortBy(products as IProduct[], (p) => p.name);
      });
  }

  formatSetNameForSearch(productId: string, subproductId: string): string {
    return `game:"${productId}" expansion:"${subproductId}"`;
  }

  search(query: string) {
    this.router.navigate(['/search'], { queryParams: { q: query } });
  }
}
