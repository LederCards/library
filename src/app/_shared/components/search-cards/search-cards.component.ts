/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, output } from '@angular/core';

import { SearchService } from '../../../search.service';

@Component({
  selector: 'app-search-cards',
  templateUrl: './search-cards.component.html',
  styleUrls: ['./search-cards.component.scss'],
})
export class SearchCardsComponent {
  public searchService = inject(SearchService);
  public pageChanged = output<number>();

  changePage(newPage: number) {
    this.searchService.changePage(newPage);
    this.pageChanged.emit(newPage);
  }

  public getDetailHeight(): any {
    return '100%';
  }
}
