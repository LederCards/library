import { Component, Input, type OnInit } from '@angular/core';
import { type ICard } from '../../../../../interfaces';
import { type CardsService } from '../../../cards.service';

@Component({
  selector: 'app-card-display',
  templateUrl: './card-display.component.html',
  styleUrls: ['./card-display.component.scss'],
})
export class CardDisplayComponent implements OnInit {
  @Input() size: 'grid' | 'small' | 'normal' | 'large' = 'normal';
  @Input() cardCode!: string;
  @Input() display: 'images' | 'text' = 'images';

  public card: ICard | undefined;
  public soulArray = [];

  constructor(private cardsService: CardsService) {}

  ngOnInit() {
    this.card = this.cardsService.getCardById(this.cardCode);
  }
}
