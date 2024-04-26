import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import type { ICardFAQ } from '../../../interfaces';
import { FAQService } from '../faq.service';
import { MetaService } from '../meta.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private faqService = inject(FAQService);
  public metaService = inject(MetaService);

  private locale = signal<string>('');
  private productId = signal<string>('');

  public faqs = computed(() => this.faqService.getFAQs());
  public currentFAQ = computed(() =>
    this.faqService.getProductFAQ(this.productId(), this.locale())
  );

  constructor() {}

  ionViewDidEnter() {
    this.locale.set(this.route.snapshot.queryParamMap.get('locale') ?? '');
    this.productId.set(
      this.route.snapshot.queryParamMap.get('productId') ?? ''
    );

    if (!this.locale() || !this.productId()) {
      this.router.navigate(['/faq']);
      return;
    }
  }

  loadFAQ(faq: { productId: string; locale: string; faq: ICardFAQ[] }) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { locale: faq.locale, productId: faq.productId },
      queryParamsHandling: 'merge',
    });

    this.locale.set(faq.locale);
    this.productId.set(faq.productId);
  }
}
