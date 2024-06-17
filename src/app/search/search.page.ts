import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalStorageService } from 'ngx-webstorage';
import { getProductFromQuery } from '../../../search/search';
import {
  SearchService,
  type QueryDisplay,
  type QuerySort,
  type QuerySortBy,
} from '../search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {
  private route = inject(ActivatedRoute);
  private searchService = inject(SearchService);
  private storageService = inject(LocalStorageService);

  public query = '';

  public page = 0;

  ionViewDidEnter() {
    this.query =
      this.route.snapshot.queryParamMap.get('q') ||
      this.reformatQueryToJustHaveProduct(
        this.storageService.retrieve('search-query')
      ) ||
      '';

    this.searchService.queryDisplayValue =
      (this.route.snapshot.queryParamMap.get('d') as QueryDisplay) ||
      this.storageService.retrieve('search-display') ||
      'images';

    this.searchService.querySortValue =
      (this.route.snapshot.queryParamMap.get('s') as QuerySort) ||
      this.storageService.retrieve('search-sort') ||
      'id';

    this.searchService.querySortByValue =
      (this.route.snapshot.queryParamMap.get('b') as QuerySortBy) ||
      this.storageService.retrieve('search-direction') ||
      'asc';

    const setPage = parseInt(
      this.route.snapshot.queryParamMap.get('p') || '0',
      10
    );
    this.searchService.pageValue.set(setPage);

    this.searchService.search(this.query, true, setPage);
  }

  private reformatQueryToJustHaveProduct(query: string): string {
    const product = getProductFromQuery(query);
    if (!product) return '';
    return `game:"${product}"`;
  }
}
