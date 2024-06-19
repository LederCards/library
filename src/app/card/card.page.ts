import {
  Component,
  computed,
  inject,
  signal,
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
import { Meta } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';
import Handlebars from 'handlebars';
import { WINDOW } from '../_shared/helpers';
import { ErrataService } from '../errata.service';
import { FAQService } from '../faq.service';
import { NotifyService } from '../notify.service';

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
  private pageMeta = inject(Meta);

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

    return this.faqService.getCardFAQ(cardData.game, cardData.name);
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

    this.pageMeta.updateTag({ property: 'og:title', content: cardData.name });
    this.pageMeta.updateTag({ property: 'og:image', content: cardData.image });
    this.pageMeta.updateTag({
      property: 'og:description',
      content: cardData.text,
    });

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
}
