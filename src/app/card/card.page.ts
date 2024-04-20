import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICard } from '../../../interfaces';
import { CardsService } from '../cards.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {
  public cardData: ICard = undefined;
  public soulArray = [];

  public similarCards: Array<{ card: ICard; score: number }> = [];

  public deckStats: any = { decks: [] };

  // this is going to be a mess
  public encodedCardName = '';
  public encoreDecksId = '';

  public tcgplayerPrice = 0;

  public hotcCode = '';

  public json = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public cardsService: CardsService
  ) {}

  ngOnInit() {
    const cardId = this.route.snapshot.paramMap.get('id');
    this.cardData = this.cardsService.getCardById(cardId);

    if (!this.cardData) {
      this.router.navigate(['/']);
      return;
    }

    this.loadCardExtraData();
    this.getCardsLikeThisCard();
  }

  search(query: string) {
    this.router.navigate(['/search'], { queryParams: { q: query } });
  }

  private async loadCardExtraData() {}

  searchTag(tag: string) {
    this.search(`tag:"${tag}"`);
  }

  private getCardsLikeThisCard() {
    this.similarCards = this.cardsService.getCardsLikeCard(this.cardData, 4);
  }
}
