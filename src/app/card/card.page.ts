import {
  Component,
  computed,
  effect,
  inject,
  viewChild,
  type ElementRef,
  type OnDestroy,
  type OnInit,
  type Signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import type {
  ICard,
  ICardErrataEntry,
  ICardFAQEntry,
} from '../../../interfaces';
import { CardsService } from '../cards.service';
import { MetaService } from '../meta.service';

import { DOCUMENT } from '@angular/common';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import Handlebars from 'handlebars';
import { environment } from '../../environments/environment';
import { WINDOW } from '../_shared/helpers';
import { ErrataService } from '../errata.service';
import { FAQService } from '../faq.service';
import { NotifyService } from '../notify.service';
import { SEOService } from '../seo.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit, OnDestroy {
  private cardPage = viewChild<ElementRef<HTMLElement>>('cardPage');

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private nav = inject(NavController);
  private window = inject(WINDOW);
  private document = inject(DOCUMENT);
  private seo = inject(SEOService);

  private translateService = inject(TranslateService);
  private cardsService = inject(CardsService);
  private faqService = inject(FAQService);
  private errataService = inject(ErrataService);
  public metaService = inject(MetaService);
  public notify = inject(NotifyService);

  private routeParamMap = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  public cardData = computed(() => {
    const id = this.routeParamMap().get('id');
    return id ? this.cardsService.getCardById(id) : undefined
  });

  public template = computed(() => {
    const cardData = this.cardData();
    if (!cardData) return "";

    const template = this.metaService.getTemplateByProductId(cardData.game);
    const compiled = Handlebars.compile(template);
    return compiled(cardData)
  });

  public get copyText(): string {
    const location = this.window.location;
    return `${location.origin}${location.pathname}`
  }

  public faq: Signal<ICardFAQEntry[]> = computed(() => {
    const cardData = this.cardData();
    if (!cardData) return [];

    return this.faqService.getCardFAQ(cardData.game, cardData);
  });

  public errata: Signal<ICardErrataEntry[]> = computed(() => {
    const cardData = this.cardData();
    if (!cardData) return [];

    return this.errataService.getCardErrata(cardData.game, cardData.name);
  });

  private destroySignal?: AbortController;

  constructor() {
    effect(() => {
      const data = this.cardData();
      if (data) this.updateMeta(data);
    })

    // Redirect to the home page if this card doesn't exist, but take care
    // to only do it after the fetch of card data is complete
    effect(() => {
      if (this.cardsService.loaded) {
        if (!this.cardData()) {
          this.router.navigate(['/']);
        }
      }
    })
  }

  ngOnInit() {
    const abort = new AbortController();
    this.destroySignal = abort;

    this.cardPage()?.nativeElement.addEventListener(
      'click',
      (evt) => {
        evt.stopPropagation();
        evt.preventDefault();

        const href = (evt.target as HTMLAnchorElement | null)?.href;
        if (!href) return;

        const dest = new URL(href, location.origin);

        // external links
        if (dest.origin !== location.origin) {
          this.window.open(href, '_blank');
          return;
        }

        // internal links
        if (href.includes('faq') || href.includes('errata')) return;

        const [, , cardId] = dest.pathname.split('/');
        this.router.navigate(['/card', decodeURIComponent(cardId)]);
      },
      {signal: abort.signal},
    );

    this.document.body.addEventListener(
      'keydown',
      (evt) => {
        const key = evt.key;
        if (!['Backspace', 'Escape'].includes(key)) return;
        if (this.document.activeElement?.tagName === 'INPUT') return;

        this.nav.back();
      },
      { signal: abort.signal }
    );
  }

  ngOnDestroy() {
    this.destroySignal?.abort();
    this.document.querySelector('#card-metadata')?.remove();
  }

  search(query: string) {
    this.router.navigate(['/search'], { queryParams: { q: query } });
  }

  searchTag(tag: string) {
    this.search(`game:"${this.cardData()?.game}" tag:"${tag}"`);
  }

  private updateMeta(cardData: ICard) {
    const text = cardData.text
      ? this.removeEmojis(cardData.text)
      : 'No text entered for this card.';

    this.seo.updateOGTitle(cardData.name);
    this.seo.updateOGImage(cardData.image);
    this.seo.updateOGDescription(text);
    this.seo.updateOGURL(
      `${environment.baseAppUrl}/card/${encodeURIComponent(cardData.id)}`
    );

    this.seo.updateMetaDescription(
      `${cardData.name} (${
        cardData.id
      }) is a card in the ${this.metaService.getProductNameByProductId(
        cardData.game
      )} board game, part of the ${this.metaService.getProductNameByProductId(
        cardData.product
      )} set. It has ${this.faq().length} FAQ and ${
        this.errata().length
      } errata associated with it.`
    );

    this.seo.updatePageTitle(`Leder Card Library - ${cardData.name}`);

    const ldData = this.document.createElement('script');
    ldData.id = 'card-metadata';
    ldData.type = 'application/ld+json';

    ldData.textContent = `
    {
      "@context": "https://schema.org/",
      "@type": "ImageObject",
      "contentUrl": "${cardData.image}",
      "creator": {
        "@type": "Organization",
        "name": "${this.translateService.instant('Common.Company')}"
       },
      "copyrightNotice": "${this.translateService.instant('Common.Company')}"
    }`;

    this.document.head.appendChild(ldData);
  }

  private removeEmojis(text: string) {
    return text.split('`').join('').split('symbol:').join('');
  }
}
