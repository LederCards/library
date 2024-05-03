import {
  Component,
  computed,
  inject,
  signal,
  type OnInit,
  type Signal,
  type WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { type ICard, type ICardFAQEntry } from '../../../interfaces';
import { CardsService } from '../cards.service';
import { MetaService } from '../meta.service';

import Handlebars from 'handlebars';
import { FAQService } from '../faq.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cardsService = inject(CardsService);
  private faqService = inject(FAQService);
  public metaService = inject(MetaService);

  public cardData: WritableSignal<ICard | undefined> = signal(undefined);
  public template = '';

  public faq: Signal<ICardFAQEntry[]> = computed(() => {
    const cardData = this.cardData();
    if (!cardData) return [];

    return this.faqService.getCardFAQ(cardData.product, cardData.name);
  });

  ngOnInit() {
    const cardId = this.route.snapshot.paramMap.get('id');
    const cardData = this.cardsService.getCardById(cardId ?? '');

    if (!cardData) {
      this.router.navigate(['/']);
      return;
    }

    const template = this.metaService.getTemplateByProductId(cardData.product);
    const compiledTemplate = Handlebars.compile(template);
    this.template = compiledTemplate(cardData);

    this.cardData.set(cardData);
  }

  search(query: string) {
    this.router.navigate(['/search'], { queryParams: { q: query } });
  }

  searchTag(tag: string) {
    this.search(`product:"${this.cardData()?.product}" tag:"${tag}"`);
  }
}
