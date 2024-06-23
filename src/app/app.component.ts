import { Component, effect, inject, type OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { LocaleService } from './locale.service';
import { SEOService } from './seo.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private seo = inject(SEOService);
  private locale = inject(LocaleService);

  constructor() {
    effect(() => {
      const currentLocale = this.locale.currentLocale();
      this.seo.updatePageLanguage(currentLocale);
    });
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.route),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((event) => {
        if (event['title']) {
          this.seo.updatePageTitle(event['title']);
        }

        if (event['description']) {
          this.seo.updateMetaDescription(event['description']);
        }

        if (event['noindex']) {
          this.seo.makePageUnindexable();
        } else {
          this.seo.makePageIndexable();
        }
      });
  }
}
