import { Component, inject, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { type ICard } from '../../../interfaces';
import { CardsService } from '../cards.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cardsService = inject(CardsService);

  public cardData: ICard | undefined = undefined;

  ngOnInit() {
    const cardId = this.route.snapshot.paramMap.get('id');
    this.cardData = this.cardsService.getCardById(cardId ?? '');

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
