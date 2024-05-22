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
import { type ICard, type ICardFAQEntry } from '../../../interfaces';
import { CardsService } from '../cards.service';
import { MetaService } from '../meta.service';

import { NavController } from '@ionic/angular';
import Handlebars from 'handlebars';
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

  private cardsService = inject(CardsService);
  private faqService = inject(FAQService);
  public metaService = inject(MetaService);
  public notify = inject(NotifyService);

  public cardData: WritableSignal<ICard | undefined> = signal(undefined);
  public template = '';

  public get copyText(): string {
    return window.location.toString();
  }

  public faq: Signal<ICardFAQEntry[]> = computed(() => {
    const cardData = this.cardData();
    if (!cardData) return [];

    return this.faqService.getCardFAQ(cardData.game, cardData.name);
  });

  private clickListener!: () => void;

  private backListener = (evt: KeyboardEvent) => {
    const key = evt.key;
    if (!['Backspace', 'Escape'].includes(key)) return;

    this.nav.back();
  };

  ngOnInit() {
    const cardId = this.route.snapshot.paramMap.get('id');
    const cardData = this.cardsService.getCardById(cardId ?? '');

    if (!cardData) {
      this.router.navigate(['/']);
      return;
    }

    const template = this.metaService.getTemplateByProductId(cardData.game);
    const compiledTemplate = Handlebars.compile(template ?? '');
    this.template = compiledTemplate(cardData);

    this.cardData.set(cardData);

    this.clickListener = this.cardPage()?.nativeElement.addEventListener(
      'click',
      (evt: Event) => {
        evt.stopPropagation();
        evt.preventDefault();

        const href = (evt.target as HTMLAnchorElement)?.href;
        if (!href) return;

        const url = new URL(href);
        const [, , cardId] = url.pathname.split('/');
        this.router.navigate(['/card', decodeURIComponent(cardId)]);
      }
    );

    document.body.addEventListener('keydown', this.backListener);
  }

  ngOnDestroy() {
    if (this.clickListener) {
      this.cardPage()?.nativeElement.removeEventListener(
        'click',
        this.clickListener
      );
    }

    if (this.backListener) {
      document.body.removeEventListener('keydown', this.backListener);
    }
  }

  search(query: string) {
    this.router.navigate(['/search'], { queryParams: { q: query } });
  }

  searchTag(tag: string) {
    this.search(`game:"${this.cardData()?.game}" tag:"${tag}"`);
  }
}
