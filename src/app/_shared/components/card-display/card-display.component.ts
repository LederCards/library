import { Component, inject, Input, type OnInit } from '@angular/core';
import { type ICard } from '../../../../../interfaces';
import { CardsService } from '../../../cards.service';

@Component({
  selector: 'app-card-display',
  templateUrl: './card-display.component.html',
  styleUrls: ['./card-display.component.scss'],
})
export class CardDisplayComponent implements OnInit {
  private cardsService = inject(CardsService);

  @Input() size: 'grid' | 'small' | 'normal' | 'large' = 'normal';
  @Input() cardCode!: string;
  @Input() display: 'images' | 'text' = 'images';

  public card: ICard | undefined;
  public soulArray = [];

  ngOnInit() {
    this.card = this.cardsService.getCardById(this.cardCode);
  }
}
