import { Component, inject, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorage } from 'ngx-webstorage';

import { isNumber } from 'lodash';

import { CardsService } from '../cards.service';

const defaultQuery = () => ({
  name: '',
  attribute: '',
  color: { b: false, g: false, r: false, y: false },
  cost: { operator: '=', value: undefined },
  expansion: [],
  level: { operator: '=', value: undefined },
  power: { operator: '=', value: undefined },
  rarity: [],
  side: { w: false, s: false },
  soul: { operator: '=', value: undefined },
  tags: [],
  trigger: {},
  type: { character: false, event: false, climax: false },
});

@Component({
  selector: 'app-advanced',
  templateUrl: './advanced.page.html',
  styleUrls: ['./advanced.page.scss'],
})
export class AdvancedPage implements OnInit {
  private router = inject(Router);
  private cardsService = inject(CardsService);

  public allOperators = [
    { value: '=', label: 'Equal To' },
    { value: '!=', label: 'Not Equal To' },
    { value: '>', label: 'Greater Than' },
    { value: '<', label: 'Less Than' },
    { value: '>=', label: 'Greater Than Or Equal To' },
    { value: '<=', label: 'Less Than Or Equal To' },
  ];

  public allTags: string[] = [];

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
  }

  saveQuery() {
    // eslint-disable-next-line no-self-assign
    this.searchQuery = this.searchQuery;
  }

  getSearchQuery() {
    const queryAttributes = [];

    if (this.searchQuery.name) {
      queryAttributes.push(`name:"${this.searchQuery.name}"`);
    }

    if (this.searchQuery.attribute.length > 0) {
      queryAttributes.push(
        `attribute:"${this.searchQuery.attribute.join(',')}"`
      );
    }

    const colors = Object.keys(this.searchQuery.color).filter(
      (c) => this.searchQuery.color[c]
    );
    if (colors.length > 0) {
      queryAttributes.push(`color:${colors.join(',')}`);
    }

    if (
      isNumber(+this.searchQuery.cost.value) &&
      !isNaN(+this.searchQuery.cost.value)
    ) {
      queryAttributes.push(
        `cost:${this.searchQuery.cost.operator}${this.searchQuery.cost.value}`
      );
    }

    if (this.searchQuery.expansion.length > 0) {
      const exactExpansions = this.searchQuery.expansion.map(
        (e: string) => `=${e}`
      );
      queryAttributes.push(`expansion:"${exactExpansions.join(',')}"`);
    }

    if (
      isNumber(+this.searchQuery.level.value) &&
      !isNaN(+this.searchQuery.level.value)
    ) {
      queryAttributes.push(
        `level:${this.searchQuery.level.operator}${this.searchQuery.level.value}`
      );
    }

    if (
      isNumber(+this.searchQuery.power.value) &&
      !isNaN(+this.searchQuery.power.value)
    ) {
      queryAttributes.push(
        `power:${this.searchQuery.power.operator}${this.searchQuery.power.value}`
      );
    }

    if (this.searchQuery.rarity.length > 0) {
      queryAttributes.push(`rarity:"${this.searchQuery.rarity.join(',')}"`);
    }

    const sides = Object.keys(this.searchQuery.side).filter(
      (s) => this.searchQuery.side[s]
    );
    if (sides.length > 0) {
      queryAttributes.push(`side:${sides.join(',')}`);
    }

    if (
      isNumber(+this.searchQuery.soul.value) &&
      !isNaN(+this.searchQuery.soul.value)
    ) {
      queryAttributes.push(
        `soul:${this.searchQuery.soul.operator}${this.searchQuery.soul.value}`
      );
    }

    if (this.searchQuery.tags.length > 0) {
      queryAttributes.push(`tag:"${this.searchQuery.tags.join(',')}"`);
    }

    const triggers = Object.keys(this.searchQuery.trigger).filter(
      (t) => this.searchQuery.trigger[t]
    );
    if (triggers.length > 0) {
      queryAttributes.push(`trigger:"${triggers.join(',')}"`);
    }

    const types = Object.keys(this.searchQuery.type).filter(
      (t) => this.searchQuery.type[t]
    );
    if (types.length > 0) {
      queryAttributes.push(`type:${types.join(',')}`);
    }

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
