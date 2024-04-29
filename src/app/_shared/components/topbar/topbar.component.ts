import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../../../search.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  private router = inject(Router);
  private searchService = inject(SearchService);

  public title = input<string>('');
  public showSearch = input<boolean>(true);
  public query = input<string>('');

  public searchOnType = input<boolean>(false);
  public searchOnEnter = input<boolean>(false);

  doType($event: string) {
    if (!this.searchOnType()) return;
    this.search($event);
  }

  doEnter($event: string) {
    if (!this.searchOnEnter()) return;
    this.search($event);
  }

  private search(query: string) {
    this.router.navigate(['/search'], {
      queryParamsHandling: 'merge',
      queryParams: { q: query },
    });

    this.searchService.search(query);
  }
}
