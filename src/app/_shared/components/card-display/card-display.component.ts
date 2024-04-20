import { Component, Input, OnInit } from '@angular/core';
import { ICard } from '../../../../../interfaces';
import { CardsService } from '../../../cards.service';

@Component({
  selector: 'app-card-display',
  templateUrl: './card-display.component.html',
  styleUrls: ['./card-display.component.scss'],
})
export class CardDisplayComponent implements OnInit {
  @Input() size: 'grid' | 'small' | 'normal' | 'large' = 'normal';
  @Input() cardCode: string;
  @Input() display: 'images' | 'text' = 'images';

  public card: ICard;
  public soulArray = [];

  constructor(private cardsService: CardsService) {}

  ngOnInit() {
    this.card = this.cardsService.getCardById(this.cardCode);
  }
}
