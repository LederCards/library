import { inject, Pipe, type PipeTransform } from '@angular/core';
import { CardsService } from '../../cards.service';
import { MetaService } from '../../meta.service';

@Pipe({
  name: 'faq',
})
export class FaqPipe implements PipeTransform {
  private metaService = inject(MetaService);
  private cardsService = inject(CardsService);

  transform(value: string, ...args: (string | undefined)[]): string {
    const [productId, cardDisplay] = args;
    if (!productId) return value ?? '';

    const ruleRegex = /\$rule:(.*)\$/gm;
    value = value.replace(ruleRegex, (match, p1) => {
      const [rule, locale, version] = p1.split(':');
      if (!productId) return p1;

      const rulesUrl = this.metaService.getRulesByProductId(productId);
      if (!rulesUrl) return p1;

      const url = new URL(rulesUrl);
      url.hash = rule;
      url.searchParams.set('product', productId);
      if (locale) url.searchParams.set('locale', locale);
      if (version) url.searchParams.set('version', version);

      return `<a href="${url.toString()}" target="_blank">${
        cardDisplay || rule || p1
      }</a>`;
    });

    const linkRegex = /\$link:([\w'"\-& ]+)\$/gm;
    value = value.replace(linkRegex, (match, p1) => {
      if (!productId) return p1;

      const foundCard = this.cardsService.getCardByIdOrName(p1);
      if (!foundCard) return p1;

      return `<a href="card/${encodeURIComponent(
        foundCard.id
      )}" target="_blank">${cardDisplay || foundCard.name}</a>`;
    });

    value = value.replace('\n', '<br>');

    return value;
  }
}
