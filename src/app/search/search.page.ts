import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { ICard } from '../../../interfaces';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {

  @ViewChild(DatatableComponent) table: DatatableComponent;

  public query = '';

  public queryDisplay: 'images'|'text'|'checklist' = 'images';
  public querySort: keyof ICard = 'name';
  public querySortBy: 'asc'|'desc' = 'asc';
  public page = 0;

  public get isDeckSearch() {
    return this.query.includes('is:deck');
  }

  constructor(
    private route: ActivatedRoute
  ) { }

  ionViewDidEnter() {
    this.query = this.route.snapshot.queryParamMap.get('q') || '';
    this.queryDisplay = this.route.snapshot.queryParamMap.get('d') as 'images'|'text' || 'images';
    this.querySort = this.route.snapshot.queryParamMap.get('s') as keyof ICard || 'name';
    this.querySortBy = this.route.snapshot.queryParamMap.get('b') as 'asc'|'desc' || 'asc';

    this.page = parseInt(this.route.snapshot.queryParamMap.get('p') || '0', 10);

    this.search(this.query);
  }

  search(query: string) {
    this.query = query;
  }

}
