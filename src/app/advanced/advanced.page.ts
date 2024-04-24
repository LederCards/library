import { Component, inject, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorage } from 'ngx-webstorage';

import { sortBy, uniqBy } from 'lodash';
import { CardsService } from '../cards.service';
import { MetaService } from '../meta.service';

const defaultQuery = () => ({
  name: '',
  product: undefined,
  subproduct: [],
  tags: [],
});

interface DropdownForProductItem {
  product: string;
  value: string;
  label: string;
}

@Component({
  selector: 'app-advanced',
  templateUrl: './advanced.page.html',
  styleUrls: ['./advanced.page.scss'],
})
export class AdvancedPage implements OnInit {
  private router = inject(Router);
  private cardsService = inject(CardsService);
  private metaService = inject(MetaService);

  public allOperators = [
    { value: '=', label: 'Equal To' },
    { value: '!=', label: 'Not Equal To' },
    { value: '>', label: 'Greater Than' },
    { value: '<', label: 'Less Than' },
    { value: '>=', label: 'Greater Than Or Equal To' },
    { value: '<=', label: 'Less Than Or Equal To' },
  ];

  public allTags: string[] = [];
  public allProducts: DropdownForProductItem[] = [];
  public allSubproducts: DropdownForProductItem[] = [];

  public visibleSubproducts: DropdownForProductItem[] = [];
  public visibleTags: string[] = [];

  @LocalStorage()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchQuery: any;

  ngOnInit() {
    if (!this.searchQuery) {
      this.searchQuery = defaultQuery();
    }

    // in case we add new fields that the cached query doesn't have available
    this.searchQuery = Object.assign({}, defaultQuery(), this.searchQuery);

    this.allTags = this.cardsService.getAllUniqueAttributes('tags');
    this.allProducts = uniqBy(
      this.metaService.products.map((p) => ({
        product: p.id,
        label: p.name,
        value: p.id,
      })),
      (p) => p.value
    );

    this.allSubproducts = sortBy(
      this.metaService.products
        .map((p) =>
          p.subproducts.map((s) => ({
            product: p.id,
            label: s.name,
            value: s.id,
          }))
        )
        .flat(),
      (p) => p.label
    );

    this.visibleSubproducts = this.allSubproducts;
    this.visibleTags = this.allTags;

    this.setSubproductsBasedOnProduct();
  }

  saveQuery() {
    // eslint-disable-next-line no-self-assign
    this.searchQuery = this.searchQuery;
  }

  changeProduct() {
    this.searchQuery.subproducts = [];
    this.searchQuery.tags = [];

    this.setSubproductsBasedOnProduct();
  }

  setSubproductsBasedOnProduct() {
    if (!this.searchQuery.product) {
      this.visibleSubproducts = this.allSubproducts;
    } else {
      this.visibleSubproducts = this.allSubproducts.filter(
        (sp) => sp.product === this.searchQuery.product.value
      );
    }
  }

  getSearchQuery() {
    const queryAttributes = [];

    if (this.searchQuery.name) {
      queryAttributes.push(`name:"${this.searchQuery.name}"`);
    }

    if (this.searchQuery.product?.value) {
      queryAttributes.push(`product:"${this.searchQuery.product.value}"`);
    }

    if (this.searchQuery.subproducts?.length > 0) {
      const exactExpansions = this.searchQuery.subproducts.map(
        (e: { value: string }) => `=${e.value}`
      );
      queryAttributes.push(`subproduct:"${exactExpansions.join(',')}"`);
    }

    if (this.searchQuery.tags.length > 0) {
      queryAttributes.push(`tag:"${this.searchQuery.tags.join(',')}"`);
    }

    const query = queryAttributes.join(' ');

    return query;
  }

  querySearch() {
    const query = this.getSearchQuery();
    if (!query) {
      return;
    }

    this.search(query);
  }

  reset() {
    this.searchQuery = defaultQuery();
  }

  search(query: string) {
    this.router.navigate(['/search'], { queryParams: { q: query } });
  }
}
