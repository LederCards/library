import {
  Component,
  computed,
  inject,
  signal,
  type OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, EventType, Router } from '@angular/router';
import { filter } from 'rxjs';
import type { ICardErrata } from '../../../interfaces';
import { tryNavigateToHash } from '../_shared/helpers';
import { ErrataService } from '../errata.service';
import { MetaService } from '../meta.service';

@Component({
  selector: 'app-errata',
  templateUrl: './errata.page.html',
  styleUrls: ['./errata.page.scss'],
})
export class ErrataPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private errataService = inject(ErrataService);
  public metaService = inject(MetaService);

  private locale = signal<string>('');
  public productId = signal<string>('');

  public erratas = computed(() => this.errataService.getErrata());
  public currentErrata = computed(() =>
    this.errataService.getProductErrata(this.productId(), this.locale())
  );
  public errataProductName = computed(() =>
    this.metaService.getProductNameByProductId(this.productId())
  );

  constructor() {
    this.router.events
      .pipe(takeUntilDestroyed())
      .pipe(filter((evt) => evt.type === EventType.NavigationEnd))
      .subscribe(() => this.parseQueryParams());
  }

  ngOnInit() {
    tryNavigateToHash();
  }

  ionViewDidEnter() {
    this.parseQueryParams();

    if (!this.locale() || !this.productId()) {
      this.router.navigate(['/errata']);
      return;
    }
  }

  loadErrata(errata: {
    productId: string;
    locale: string;
    errata: ICardErrata[];
  }) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { locale: errata.locale, productId: errata.productId },
      queryParamsHandling: 'merge',
    });

    this.locale.set(errata.locale);
    this.productId.set(errata.productId);

    this.parseQueryParams();
  }

  private parseQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);

    this.locale.set(urlParams.get('locale') ?? '');
    this.productId.set(urlParams.get('productId') ?? '');
  }
}
