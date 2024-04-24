import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatatableComponent } from '@siemens/ngx-datatable';

import { type ICard } from '../../../interfaces';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {
  private route = inject(ActivatedRoute);

  @ViewChild(DatatableComponent) table!: DatatableComponent;

  public query = '';

  public queryDisplay: 'images' | 'text' | 'checklist' = 'images';
  public querySort: keyof ICard = 'name';
  public querySortBy: 'asc' | 'desc' = 'asc';
  public page = 0;

  ionViewDidEnter() {
    this.query = this.route.snapshot.queryParamMap.get('q') || '';
    this.queryDisplay =
      (this.route.snapshot.queryParamMap.get('d') as 'images' | 'text') ||
      'images';
    this.querySort =
      (this.route.snapshot.queryParamMap.get('s') as keyof ICard) || 'name';
    this.querySortBy =
      (this.route.snapshot.queryParamMap.get('b') as 'asc' | 'desc') || 'asc';

    this.page = parseInt(this.route.snapshot.queryParamMap.get('p') || '0', 10);

    this.search(this.query);
  }

  search(query: string) {
    this.query = query;
  }
}
