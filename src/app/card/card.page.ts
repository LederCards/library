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
  }

  search(query: string) {
    this.router.navigate(['/search'], { queryParams: { q: query } });
  }

  searchTag(tag: string) {
    this.search(`tag:"${tag}"`);
  }
}
