import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private router = inject(Router);

  public searchQuery = '';

  search(query: string) {
    this.router.navigate(['/search'], { queryParams: { q: query } });
  }
}
