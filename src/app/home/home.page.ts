import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public searchQuery = '';

  constructor(private router: Router) {}

  search(query: string) {
    this.router.navigate(['/search'], { queryParams: { q: query } });
  }

}
