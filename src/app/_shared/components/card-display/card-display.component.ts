import { Component, inject, input, type OnInit } from '@angular/core';
import { type ICard } from '../../../../../interfaces';
import { CardsService } from '../../../cards.service';

type CardSize = 'grid' | 'small' | 'normal' | 'large';
type CardDisplay = 'images' | 'text';

@Component({
  selector: 'app-card-display',
  templateUrl: './card-display.component.html',
  styleUrls: ['./card-display.component.scss'],
})
export class CardDisplayComponent implements OnInit {
  private cardsService = inject(CardsService);

  public size = input<CardSize>('normal');
  public cardCode = input.required<string>();
  public display = input<CardDisplay>('images');

  public card: ICard | undefined;
  public soulArray = [];

  ngOnInit() {
    this.card = this.cardsService.getCardById(this.cardCode());
  }
}
