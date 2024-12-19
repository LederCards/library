import { Component, computed, inject, input, type Signal } from '@angular/core';
import {
  type ICard,
  type ICardErrataEntry,
  type ICardFAQEntry,
} from '../../../../../interfaces';
import { CardsService } from '../../../cards.service';
import { ErrataService } from '../../../errata.service';
import { FAQService } from '../../../faq.service';

type CardSize = 'grid' | 'small' | 'normal' | 'large';
type CardDisplay = 'images' | 'text';

@Component({
  selector: 'app-card-display',
  templateUrl: './card-display.component.html',
  styleUrls: ['./card-display.component.scss'],
})
export class CardDisplayComponent {
  private cardsService = inject(CardsService);
  private faqService = inject(FAQService);
  private errataService = inject(ErrataService);

  public size = input<CardSize>('normal');
  public cardCode = input.required<string>();
  public display = input<CardDisplay>('images');

  public displayText = true;

  public get queryString() {
    return new URLSearchParams(window.location.search).get('q');
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

  public cardData: Signal<ICard | undefined> = computed(() => {
    return this.cardsService.getCardById(this.cardCode());
  });

  public altText: Signal<string> = computed(() => {
    const card = this.cardData();
    if (!card) return '';

    return `${card.id} - ${card.name} - card image display`;
  });
}
