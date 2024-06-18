import { inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { sortBy } from 'lodash';
import { LocalStorageService } from 'ngx-webstorage';
import type { ICard } from '../../interfaces';
import { queryToText } from '../../search/search';
import { CardsService } from './cards.service';

export type QueryDisplay = 'images' | 'text';
export type QuerySort = keyof ICard;
export type QuerySortBy = 'asc' | 'desc';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cardsService = inject(CardsService);
  private storageService = inject(LocalStorageService);

  public visibleCards = signal<ICard[]>([]);
  public queryDesc = signal<string>('');
  public queryString = signal<string>('');

  public isSearching = signal<boolean>(false);

  public readonly cardsPerPage = 60;
  public queriedCards: ICard[] = [];

  public totalPages = signal<number>(0);
  public pageValue = signal<number>(0);

  public displayCurrent = signal<number>(0);
  public displayTotal = signal<number>(0);
  public displayMaximum = signal<number>(0);

  private queryValue = '';

  public queryDisplayValue: QueryDisplay = 'images';
  public querySortValue: QuerySort = 'name';
  public querySortByValue: QuerySortBy = 'asc';

  search(query: string, changePage = true, setPage = -1) {
    this.isSearching.set(true);

    this.queryValue = query;
    this.pageValue.set(0);
    this.totalPages.set(0);
    this.displayCurrent.set(0);
    this.displayTotal.set(0);
    this.displayMaximum.set(0);

    this.queriedCards = this.cardsService.searchCards(this.queryValue);
    this.doExtraSorting();

    if (changePage) {
      this.changePage(setPage >= 0 ? setPage : 0);
    }

    this.queryString.set(this.queryValue);
    this.storageService.store('search-query', this.queryValue);

    this.queryDesc.set(
      queryToText(this.queryValue, this.queriedCards.length > 1)
    );

    this.isSearching.set(false);
  }

  redoCurrentSearch() {
    this.updateParams();
    this.search(this.queryValue);
  }

  changePage(newPage: number) {
    this.pageValue.set(newPage);
    this.totalPages.set(
      Math.ceil(this.queriedCards.length / this.cardsPerPage) - 1
    );

    if (this.pageValue() > this.totalPages()) {
      this.pageValue.set(this.totalPages());
    }

    if (this.pageValue() < 0) {
      this.pageValue.set(0);
    }

    this.visibleCards.set(
      this.queriedCards.slice(
        this.pageValue() * this.cardsPerPage,
        (this.pageValue() + 1) * this.cardsPerPage
      )
    );

    this.displayCurrent.set(this.pageValue() * this.cardsPerPage + 1);
    this.displayTotal.set(this.queriedCards.length);
    this.displayMaximum.set(
      Math.min(this.displayTotal(), (this.pageValue() + 1) * this.cardsPerPage)
    );

    this.updateParams();
  }

  private updateParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: this.queryValue,
        d: this.queryDisplayValue,
        s: this.querySortValue,
        b: this.querySortByValue,
        p: this.pageValue(),
      },
      queryParamsHandling: 'merge',
    });
  }

  private doExtraSorting() {
    this.queriedCards = sortBy(this.queriedCards, this.querySortValue);
    if (this.querySortByValue === 'desc') {
      this.queriedCards = this.queriedCards.reverse();
    }
  }

  public resetCards() {
    this.visibleCards.set([]);
  }
}
