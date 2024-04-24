import { Component, inject, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { type ICard } from '../../../interfaces';
import { CardsService } from '../cards.service';
import { MetaService } from '../meta.service';

import Handlebars from 'handlebars';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cardsService = inject(CardsService);
  private metaService = inject(MetaService);

  public cardData: ICard | undefined = undefined;
  public template = '';

  ngOnInit() {
    const cardId = this.route.snapshot.paramMap.get('id');
    this.cardData = this.cardsService.getCardById(cardId ?? '');

    if (!this.cardData) {
      this.router.navigate(['/']);
      return;
    }

    const template = this.metaService.getTemplateByProductId(
      this.cardData.product
    );
    const compiledTemplate = Handlebars.compile(template);
    this.template = compiledTemplate(this.cardData);
  }

  search(query: string) {
    this.router.navigate(['/search'], { queryParams: { q: query } });
  }

  searchTag(tag: string) {
    this.search(`tag:"${tag}"`);
  }
}
