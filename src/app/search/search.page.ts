import { Component, inject, type OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalStorageService } from 'ngx-webstorage';
import { reformatQueryToJustHaveProduct } from '../../../search/search';
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
export class SearchPage implements OnInit {
  private route = inject(ActivatedRoute);
  private searchService = inject(SearchService);
  private storageService = inject(LocalStorageService);

  public query = '';

  public page = 0;

  ngOnInit() {
    this.searchService.isSearching.set(true);

    this.route.queryParams.subscribe((params) => {
      const newQuery = params['q'];
      if (newQuery === this.query) return;

      this.extractArgsFromQueryParamsAndSearch();
    });
  }

  ionViewDidEnter() {
    this.extractArgsFromQueryParamsAndSearch();
  }

  private extractArgsFromQueryParamsAndSearch() {
    this.route.queryParamMap.subscribe((paramMap) => {
      this.query =
        paramMap.get('q') ||
        reformatQueryToJustHaveProduct(
          this.storageService.retrieve('search-query')
        ) ||
        '';

      this.searchService.queryDisplayValue =
        (paramMap.get('d') as QueryDisplay) ||
        this.storageService.retrieve('search-display') ||
        'images';

      this.searchService.querySortValue =
        (paramMap.get('s') as QuerySort) ||
        this.storageService.retrieve('search-sort') ||
        'id';

      this.searchService.querySortByValue =
        (paramMap.get('b') as QuerySortBy) ||
        this.storageService.retrieve('search-direction') ||
        'asc';

      const setPage = parseInt(paramMap.get('p') || '0', 10);
      this.searchService.pageValue.set(setPage);

      this.searchService.search(this.query, true, setPage);
    });
  }
}
