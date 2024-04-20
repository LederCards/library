import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { sortBy } from 'lodash';

@Component({
  selector: 'app-sets',
  templateUrl: './sets.page.html',
  styleUrls: ['./sets.page.scss'],
})
export class SetsPage implements OnInit {

  private allExpansions: Record<string, any> = {};

  public sort: 'year'|'name' = 'name';
  public allYears: number[] = [];
  public allNames: string[] = [];

  get expansions() {
    return this.allExpansions;
  }

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  async ngOnInit() {
    this.http.get('https://data.limelight.cards/expansions.json').subscribe(sets => {
      this.allExpansions = sets;

      this.allYears = sortBy([...new Set(Object.values(this.allExpansions).map((expansion: any) => expansion.release).flat())]).reverse();
      this.allNames = sortBy(Object.keys(this.allExpansions), set => set.toLowerCase());
    });
  }

  getSetReleaseDates(set: string): number[] {
    return this.allExpansions[set].release;
  }

  getSetsByYear(year: number): string[] {
    return Object.keys(this.allExpansions).filter(set => this.allExpansions[set].release.includes(year));
  }

  formatSetNameForSearch(setName: string): string {
    return `expansion:"${setName}"`;
  }

  search(query: string) {
    this.router.navigate(['/search'], { queryParams: { q: query } });
  }

}
