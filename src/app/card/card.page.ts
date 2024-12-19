import {
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
  type ElementRef,
  type OnDestroy,
  type OnInit,
  type Signal,
  type WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  type ICard,
  type ICardErrataEntry,
  type ICardFAQEntry,
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
import { LocaleService } from '../locale.service';
import { NotifyService } from '../notify.service';
import { SEOService } from '../seo.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit, OnDestroy {
  private cardPage = viewChild<ElementRef>('cardPage');

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private nav = inject(NavController);
  private window = inject(WINDOW);
  private document = inject(DOCUMENT);
  private seo = inject(SEOService);

  private translateService = inject(TranslateService);
  private localeService = inject(LocaleService);
  private cardsService = inject(CardsService);
  private faqService = inject(FAQService);
  private errataService = inject(ErrataService);
  public metaService = inject(MetaService);
  public notify = inject(NotifyService);

  public cardData: WritableSignal<ICard | undefined> = signal(undefined);
  public template = '';

  public get copyText(): string {
    return this.window?.location?.toString() ?? '';
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

  private clickListener!: () => void;

  private backListener = (evt: KeyboardEvent) => {
    const key = evt.key;
    if (!['Backspace', 'Escape'].includes(key)) return;
    if (this.document.activeElement?.tagName === 'INPUT') return;

    this.nav.back();
  };

  constructor() {
    effect(() => {
      if (!this.cardData) return;

      this.localeService.currentLocale();

      untracked(() => {
        this.loadCardData(this.route.snapshot.paramMap.get('id') ?? '');
      });
    });
  }

  ngOnInit() {
    const cardId = this.route.snapshot.paramMap.get('id');
    this.loadCardData(cardId ?? '');

    this.clickListener = this.cardPage()?.nativeElement.addEventListener(
      'click',
      (evt: Event) => {
        evt.stopPropagation();
        evt.preventDefault();

        const href = (evt.target as HTMLAnchorElement)?.href;
        if (!href) return;

        // external links
        if (new URL(href).origin !== location.origin) {
          this.window.open(href, '_blank');
          return;
        }

        // internal links
        if (href.includes('faq') || href.includes('errata')) return;

        const url = new URL(href);
        const [, , cardId] = url.pathname.split('/');
        this.router.navigate(['/card', decodeURIComponent(cardId)]);
      }
    );

    this.document.body.addEventListener('keydown', this.backListener);
  }

  ngOnDestroy() {
    if (this.clickListener) {
      this.cardPage()?.nativeElement.removeEventListener(
        'click',
        this.clickListener
      );
    }

    if (this.backListener) {
      this.document.body.removeEventListener('keydown', this.backListener);
    }

    this.document.querySelector('#card-metadata')?.remove();
  }

  loadCardData(id: string) {
    const cardData = this.cardsService.getCardById(id);

    if (!cardData) {
      this.router.navigate(['/']);
      return;
    }

    const template = this.metaService.getTemplateByProductId(cardData.game);
    const compiledTemplate = Handlebars.compile(template ?? '');
    this.template = compiledTemplate(cardData);

    this.cardData.set(cardData);

    this.updateMeta(cardData);

    /*
    I might like to do something like one of these, but I want to replace the url without doing a nav.
    But, they don't currently work right. Either it does a navigation event (latter), or it won't load you load into the page directly (former).

    this.location.replaceState(
      `/card/${id}`,
      `q=${this.route.snapshot.queryParamMap.get('q') ?? ''}`
    );

    this.router.navigate(['/card', id], {
      queryParams: { q: this.route.snapshot.queryParamMap.get('q') ?? '' },
      replaceUrl: true,
    });
    */
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
