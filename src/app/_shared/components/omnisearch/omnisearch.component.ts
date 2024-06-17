import {
  Component,
  effect,
  inject,
  input,
  output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonSearchbar } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'ngx-webstorage';
import {
  getProductFromQuery,
  removeAllButBareTextAndGameFromQuery,
  removeGameFromQuery,
} from '../../../../../search/search';
import { CardsService } from '../../../cards.service';
import { MetaService } from '../../../meta.service';
import { SearchService } from '../../../search.service';

@Component({
  selector: 'app-omnisearch',
  templateUrl: './omnisearch.component.html',
  styleUrls: ['./omnisearch.component.scss'],
})
export class OmnisearchComponent {
  private route = inject(ActivatedRoute);
  private translateService = inject(TranslateService);
  private searchService = inject(SearchService);
  private storageService = inject(LocalStorageService);
  private cardsService = inject(CardsService);
  public metaService = inject(MetaService);

  @ViewChild(IonSearchbar) searchField!: IonSearchbar;

  public query = '';

  public big = input<boolean>(false);
  public initialQuery = input<string>('');
  public type = output<string>();
  public enter = output<string>();

  public chosenProduct = 'default';

  public get queryString() {
    return this.route.snapshot.queryParamMap.get('q');
  }

  public get searchFieldValue(): string {
    let baseValue = this.searchField.value ?? '';
    if (this.chosenProduct && this.chosenProduct !== 'default') {
      baseValue = `game:"${this.chosenProduct}" ${baseValue}`;
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
      this.query =
        this.initialQuery() ||
        this.searchService.queryString() ||
        this.storageService.retrieve('search-query') ||
        '';

      if (!this.query) {
        this.query = this.queryString ?? '';
      }

      this.chosenProduct = getProductFromQuery(this.query) ?? 'default';

      this.query = removeGameFromQuery(this.query).trim();
    });
  }

  doEnter(newText: string) {
    this.enter.emit(newText);
  }

  changeText(newText: string) {
    this.type.emit(newText);
  }

  changeProduct(productName: string) {
    this.chosenProduct = productName;

    this.searchField.value = removeAllButBareTextAndGameFromQuery(
      this.searchField.value ?? ''
    );

    this.changeText(this.searchFieldValue);
  }
}
