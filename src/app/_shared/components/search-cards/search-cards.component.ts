/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, effect, inject, input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatatableComponent, SelectionType } from '@siemens/ngx-datatable';
import { sortBy } from 'lodash';

import { type ICard } from '../../../../../interfaces';
import { queryToText } from '../../../../../search/search';
import { CardsService } from '../../../cards.service';

type QueryDisplay = 'images' | 'text';
type QuerySort = keyof ICard;
type QuerySortBy = 'asc' | 'desc';

@Component({
  selector: 'app-search-cards',
  templateUrl: './search-cards.component.html',
  styleUrls: ['./search-cards.component.scss'],
})
export class SearchCardsComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cardsService = inject(CardsService);

  @ViewChild(DatatableComponent) table!: DatatableComponent;

  private queryValue = '';
  public queryDisplayValue: QueryDisplay = 'images';
  public querySortValue: QuerySort = 'name';
  public querySortByValue: QuerySortBy = 'asc';
  public pageValue = 0;

  public query = input<string>('');
  public queryDisplay = input<QueryDisplay>('images');
  public querySort = input<QuerySort>('name');
  public querySortBy = input<QuerySortBy>('asc');
  public page = input<number>(0);

  public queryDesc = '';

  public readonly cardsPerPage = 60;
  public totalPages = 0;
  public queriedCards: ICard[] = [];
  public visibleCards: ICard[] = [];

  public displayCurrent = 0;
  public displayTotal = 0;
  public displayMaximum = 0;

  public selected: any[] = [];
  public expanded: any = {};
  public checkboxSelectionType: SelectionType = SelectionType.checkbox;

  constructor() {
    effect(() => {
      this.queryValue = this.query();
      this.queryDisplayValue = this.queryDisplay();
      this.querySortValue = this.querySort();
      this.querySortByValue = this.querySortBy();
      this.pageValue = this.page();

      this.search(this.queryValue, false);
      this.changePage(this.pageValue);
    });
  }

  redoCurrentSearch() {
    this.search(this.queryValue);
  }

  search(query: string, changePage = true) {
    this.queryValue = query;
    this.pageValue = 0;
    this.totalPages = 0;
    this.displayCurrent = 0;
    this.displayTotal = 0;
    this.displayMaximum = 0;

    if (!this.query) {
      this.queriedCards = [];
      this.visibleCards = [];
      this.updateParams();
      return;
    }

    this.queryDesc = queryToText(this.queryValue);

    this.queriedCards = this.cardsService.searchCards(this.queryValue);
    this.doExtraSorting();

    if (changePage) {
      this.changePage(0);
    }
  }

  updateParams() {
    if (!this.queryValue) {
      return;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: this.queryValue,
        d: this.queryDisplayValue,
        s: this.querySortValue,
        b: this.querySortByValue,
        p: this.pageValue,
      },
      queryParamsHandling: 'merge',
    });
  }

  doExtraSorting() {
    this.queriedCards = sortBy(this.queriedCards, this.querySortValue);
    if (this.querySortByValue === 'desc') {
      this.queriedCards = this.queriedCards.reverse();
    }
  }

  changePage(newPage: number) {
    this.pageValue = newPage;
    this.totalPages =
      Math.ceil(this.queriedCards.length / this.cardsPerPage) - 1;

    if (this.pageValue > this.totalPages) {
      this.pageValue = this.totalPages;
    }

    if (this.pageValue < 0) {
      this.pageValue = 0;
    }

    this.visibleCards = this.queriedCards.slice(
      this.pageValue * this.cardsPerPage,
      (this.pageValue + 1) * this.cardsPerPage
    );

    this.displayCurrent = this.pageValue * this.cardsPerPage + 1;
    this.displayTotal = this.queriedCards.length;
    this.displayMaximum = Math.min(
      this.displayTotal,
      (this.pageValue + 1) * this.cardsPerPage
    );

    this.updateParams();
  }

  select({ selected }: any) {
    this.selected = [...selected];
  }

  public getDetailHeight(): any {
    return '100%';
  }
}
