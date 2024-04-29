import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

  public query = '';

  public page = 0;

  ionViewDidEnter() {
    this.query = this.route.snapshot.queryParamMap.get('q') || '';
    this.searchService.queryDisplayValue =
      (this.route.snapshot.queryParamMap.get('d') as QueryDisplay) || 'images';
    this.searchService.querySortValue =
      (this.route.snapshot.queryParamMap.get('s') as QuerySort) || 'name';
    this.searchService.querySortByValue =
      (this.route.snapshot.queryParamMap.get('b') as QuerySortBy) || 'asc';
    this.searchService.pageValue.set(
      parseInt(this.route.snapshot.queryParamMap.get('p') || '0', 10)
    );

    this.searchService.search(this.query);
  }
}
