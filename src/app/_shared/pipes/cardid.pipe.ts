import { inject, Pipe, type PipeTransform } from '@angular/core';
import { CardsService } from '../../cards.service';

@Pipe({
  name: 'cardid',
})
export class CardIdPipe implements PipeTransform {
  private cardsService = inject(CardsService);

  transform(value: string): string {
    const foundCard = this.cardsService.getCardByIdOrName(value);
    return foundCard?.id ?? '';
  }
}
