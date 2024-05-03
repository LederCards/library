import {
  Component,
  effect,
  inject,
  input,
  output,
  ViewChild,
} from '@angular/core';
import { IonSearchbar } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { getProductFromQuery } from '../../../../../search/search';
import { MetaService } from '../../../meta.service';

@Component({
  selector: 'app-omnisearch',
  templateUrl: './omnisearch.component.html',
  styleUrls: ['./omnisearch.component.scss'],
})
export class OmnisearchComponent {
  private translateService = inject(TranslateService);
  public metaService = inject(MetaService);

  @ViewChild(IonSearchbar) searchField!: IonSearchbar;

  public query = '';

  public big = input<boolean>(false);
  public initialQuery = input<string>('');
  public type = output<string>();
  public enter = output<string>();

  public chosenProduct = 'default';

  public get searchFieldValue(): string {
    let baseValue = this.searchField.value ?? '';
    if (this.chosenProduct !== 'default') {
      baseValue = `product:"${this.chosenProduct}" ${baseValue}`;
    }

    return baseValue;
  }

  public get placeholder(): string {
    const choiceProduct = this.metaService.getProductNameByProductId(
      this.chosenProduct
    );

    const choiceKey = choiceProduct
      ? `Common.Products.${choiceProduct}`
      : 'Common.Company';

    const selectedProduct = this.translateService.instant(choiceKey);
    const text = this.translateService.instant('Components.Omnisearch.Search', {
      selectedProduct,
    });

    return text;
  }

  constructor() {
    effect(() => {
      this.query = this.initialQuery();
      this.chosenProduct = getProductFromQuery(this.query) ?? 'default';

      this.query = this.removeProductFromQuery(this.query).trim();
    });
  }

  private removeProductFromQuery(query: string) {
    return query.replace(/product:"([\w]+)"/gm, '');
  }

  doEnter(newText: string) {
    this.enter.emit(newText);
  }

  changeText(newText: string) {
    this.type.emit(newText);
  }

  changeProduct(productName: string) {
    this.chosenProduct = productName;

    this.changeText(this.searchFieldValue);
  }
}
