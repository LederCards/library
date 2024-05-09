import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, EventType, Router } from '@angular/router';
import { filter } from 'rxjs';
import type { IChangelogEntry } from '../../../interfaces';
import { ChangelogService } from '../changelog.service';
import { MetaService } from '../meta.service';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.page.html',
  styleUrls: ['./changelog.page.scss'],
})
export class ChangelogPage {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private changelogService = inject(ChangelogService);
  public metaService = inject(MetaService);

  private locale = signal<string>('');
  public productId = signal<string>('');

  public changelogs = computed(() => this.changelogService.getChangelogs());
  public currentChangelog = computed(() =>
    this.changelogService.getProductChangelog(this.productId(), this.locale())
  );
  public changelogProductName = computed(() =>
    this.metaService.getProductNameByProductId(this.productId())
  );

  constructor() {
    this.router.events
      .pipe(takeUntilDestroyed())
      .pipe(filter((evt) => evt.type === EventType.NavigationEnd))
      .subscribe(() => this.parseQueryParams());
  }

  ionViewDidEnter() {
    this.parseQueryParams();

    if (!this.locale() || !this.productId()) {
      this.router.navigate(['/changelog']);
      return;
    }
  }

  loadChangelog(faq: {
    productId: string;
    locale: string;
    changelog: IChangelogEntry[];
  }) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { locale: faq.locale, productId: faq.productId },
      queryParamsHandling: 'merge',
    });

    this.locale.set(faq.locale);
    this.productId.set(faq.productId);

    this.parseQueryParams();
  }

  private parseQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);

    this.locale.set(urlParams.get('locale') ?? '');
    this.productId.set(urlParams.get('productId') ?? '');
  }
}
