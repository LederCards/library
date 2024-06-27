import { Component, inject, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';

import { isNumber, sortBy, uniqBy } from 'lodash';
import type { IProductFilter } from '../../../interfaces';
import { getGameFromQuery } from '../../../search/search';
import { CardsService } from '../cards.service';
import { MetaService } from '../meta.service';

const defaultQuery = () => ({
  name: '',
  product: undefined,
  subproduct: [],
  tags: [],
  meta: {},
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
  public metaService = inject(MetaService);
  private storageService = inject(LocalStorageService);

  public allOperators = [
    { value: '=', label: 'EqualTo' },
    { value: '!=', label: 'NotEqualTo' },
    { value: '>', label: 'GreaterThan' },
    { value: '<', label: 'LessThan' },
    { value: '>=', label: 'GreaterThanOrEqualTo' },
    { value: '<=', label: 'LessThanOrEqualTo' },
  ];

  public allTags: string[] = [];
  public allProducts: DropdownForProductItem[] = [];
  public allSubproducts: DropdownForProductItem[] = [];

  public tagsByProduct: Record<string, string[]> = {};

  public visibleSubproducts: DropdownForProductItem[] = [];
  public visibleTags: string[] = [];

  public visibleFilters: IProductFilter[] = [];

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

    this.acquireTags();
    this.setSubproductsBasedOnProduct(this.searchQuery?.product?.product);
    this.setBasicMeta();

    this.potentiallyLoadProductFromSearch();
  }

  saveQuery() {
    // eslint-disable-next-line no-self-assign
    this.searchQuery = this.searchQuery;
  }

  changeProduct(newProduct?: { product: string }) {
    this.searchQuery.subproducts = [];
    this.searchQuery.tags = [];
    this.searchQuery.meta = {};

    this.setSubproductsBasedOnProduct(newProduct?.product);
    this.setBasicMeta();
  }

  setBasicMeta() {
    this.visibleFilters.forEach((filter) => {
      if (this.searchQuery.meta[filter.prop]) return;

      if (filter.type === 'number') {
        this.searchQuery.meta[filter.prop] = {
          operator: '=',
          value: undefined,
        };
      }
    });
  }

  acquireTags() {
    const productSets: Record<string, Set<string>> = {};

    this.cardsService.allCards.forEach((card) => {
      productSets[card.game] ??= new Set();

      card.tags.forEach((tag) => productSets[card.game].add(tag));
    });

    Object.keys(productSets).forEach((productKey) => {
      this.tagsByProduct[productKey] = [...productSets[productKey]];
    });
  }

  potentiallyLoadProductFromSearch() {
    const product = getGameFromQuery(
      this.storageService.retrieve('search-query')
    );
    if (!product) return;

    this.searchQuery.product = this.allProducts.find(
      (p) => p.value === product
    );
    this.changeProduct({ product });
  }

  setSubproductsBasedOnProduct(product: string | undefined) {
    if (!product) {
      this.visibleSubproducts = this.allSubproducts;
      this.visibleFilters = [];
      this.visibleTags = this.allTags;
    } else {
      this.visibleSubproducts = this.allSubproducts.filter(
        (sp) => sp.product === product
      );

      this.visibleFilters = this.metaService.getFiltersByProductId(product);
      this.visibleTags = this.tagsByProduct[product];
    }
  }

  getSearchQuery() {
    const queryAttributes = [];

    if (this.searchQuery.name) {
      queryAttributes.push(`name:"${this.searchQuery.name}"`);
    }

    if (this.searchQuery.text) {
      queryAttributes.push(`cardtext:"${this.searchQuery.text}"`);
    }

    if (this.searchQuery.product?.value) {
      queryAttributes.push(`game:"${this.searchQuery.product.value}"`);
    }

    if (this.searchQuery.subproducts?.length > 0) {
      const exactExpansions = this.searchQuery.subproducts.map(
        (e: { value: string }) => `${e.value}`
      );
      queryAttributes.push(`product:"${exactExpansions.join(',')}"`);
    }

    if (this.searchQuery.hasFAQ) {
      queryAttributes.push(`faq:>0`);
    }

    if (this.searchQuery.hasErrata) {
      queryAttributes.push(`errata:>0`);
    }

    if (this.searchQuery.tags.length > 0) {
      queryAttributes.push(`tag:"${this.searchQuery.tags.join(',')}"`);
    }

    this.visibleFilters.forEach((filter) => {
      if (!this.searchQuery.meta[filter.prop]) return;

      if (filter.type === 'number') {
        const { operator, value } = this.searchQuery.meta[filter.prop];
        if (!value) return;

        if (isNumber(+value) && !isNaN(+value)) {
          queryAttributes.push(`${filter.prop}:${operator}${value}`);
        }
      }
    });

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
