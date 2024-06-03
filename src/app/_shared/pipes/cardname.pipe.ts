import { inject, Pipe, type PipeTransform } from '@angular/core';
import { CardsService } from '../../cards.service';

@Pipe({
  name: 'cardname',
})
export class CardNamePipe implements PipeTransform {
  private cardsService = inject(CardsService);

  transform(value: string): string {
    const foundCard = this.cardsService.getCardByIdOrName(value);
    if (!foundCard) return value;

    return foundCard.name;
  }
}
