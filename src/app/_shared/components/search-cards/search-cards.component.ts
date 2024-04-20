import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionType, DatatableComponent } from '@swimlane/ngx-datatable';
import { sortBy } from 'lodash';

import { ICard } from '../../../../../interfaces';
import { queryToText } from '../../../../../search/search';
import { CardsService } from '../../../cards.service';

@Component({
  selector: 'app-search-cards',
  templateUrl: './search-cards.component.html',
  styleUrls: ['./search-cards.component.scss'],
})
export class SearchCardsComponent implements OnChanges {

  @ViewChild(DatatableComponent) table: DatatableComponent;

  @Input() query = '';
  @Input() queryDisplay: 'images'|'text'|'checklist' = 'images';
  @Input() querySort: keyof ICard = 'name';
  @Input() querySortBy: 'asc'|'desc' = 'asc';
  @Input() page = 0;

  public queryDesc = '';

  public readonly cardsPerPage = 60;
  public totalPages = 0;
  public queriedCards: ICard[] = [];
  public visibleCards: ICard[] = [];

  public displayCurrent = 0;
  public displayTotal = 0;
  public displayMaximum = 0;

  public selected = [];
  public expanded = {};
  public checkboxSelectionType: SelectionType = SelectionType.checkbox;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cardsService: CardsService
  ) { }

  ngOnChanges(changes: any) {
    if(changes.query) {
      this.query = changes.query.currentValue;
    }

    if(changes.queryDisplay) {
      this.queryDisplay = changes.queryDisplay.currentValue;
    }

    if(changes.querySort) {
      this.querySort = changes.querySort.currentValue;
    }

    if(changes.querySortBy) {
      this.querySortBy = changes.querySortBy.currentValue;
    }

    if(changes.page) {
      this.page = changes.page.currentValue;
    }

    this.search(this.query, false);
    this.changePage(this.page);
  }

  redoCurrentSearch() {
    this.search(this.query);
  }

  search(query: string, changePage = true) {
    this.query = query;
    this.page = 0;
    this.totalPages = 0;
    this.displayCurrent = 0;
    this.displayTotal = 0;
    this.displayMaximum = 0;

    if(!this.query) {
      this.queriedCards = [];
      this.visibleCards = [];
      this.updateParams();
      return;
    }

    this.queryDesc = queryToText(this.query);

    this.queriedCards = this.cardsService.searchCards(this.query);
    this.doExtraSorting();

    if(changePage) {
      this.changePage(0);
    }
  }

  updateParams() {
    if(!this.query) {
      return;
    }

    this.router.navigate([], { relativeTo: this.route, queryParams: {
      q: this.query,
      d: this.queryDisplay,
      s: this.querySort,
      b: this.querySortBy,
      p: this.page
    }, queryParamsHandling: 'merge' });
  }

  doExtraSorting() {
    this.queriedCards = sortBy(this.queriedCards, this.querySort);
    if(this.querySortBy === 'desc') {
      this.queriedCards = this.queriedCards.reverse();
    }
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.totalPages = Math.ceil(this.queriedCards.length / this.cardsPerPage) - 1;

    if(this.page > this.totalPages) {
      this.page = this.totalPages;
    }

    if(this.page < 0) {
      this.page = 0;
    }

    this.visibleCards = this.queriedCards.slice(this.page * this.cardsPerPage, (this.page + 1) * this.cardsPerPage);

    this.displayCurrent = this.page * this.cardsPerPage + 1;
    this.displayTotal = this.queriedCards.length;
    this.displayMaximum = Math.min(this.displayTotal, (this.page + 1) * this.cardsPerPage);

    this.updateParams();
  }

  select({ selected }) {
    this.selected = [...selected];
  }

  public getDetailHeight(): any {
    return '100%';
  }

}
