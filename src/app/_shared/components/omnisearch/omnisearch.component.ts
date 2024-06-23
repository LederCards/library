import {
  Component,
  effect,
  inject,
  input,
  output,
  ViewChild,
  type OnDestroy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonSearchbar } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { debounce } from 'lodash';
import { LocalStorageService } from 'ngx-webstorage';
import {
  getGameFromQuery,
  reformatQueryToJustHaveProduct,
  removeAllButBareTextAndGameFromQuery,
  removeGameFromQuery,
} from '../../../../../search/search';
import { MetaService } from '../../../meta.service';
import { SearchService } from '../../../search.service';

@Component({
  selector: 'app-omnisearch',
  templateUrl: './omnisearch.component.html',
  styleUrls: ['./omnisearch.component.scss'],
})
export class OmnisearchComponent implements OnDestroy {
  private route = inject(ActivatedRoute);
  private translateService = inject(TranslateService);
  private searchService = inject(SearchService);
  private storageService = inject(LocalStorageService);
  public metaService = inject(MetaService);

  private isDestroyed = false;

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
    return this.searchField.value ?? '';
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

  private debouncedTypeEmit = debounce(() => {
    if (this.isDestroyed) return;

    // yes, we need to do this _again_ here, in case the user leaves a game: prompt in their query with a game selected
    this.tryChangeProductBasedOnQuery(this.query);
    this.type.emit(this.emittedText());
  }, 1000);

  constructor() {
    effect(() => {
      this.query =
        this.initialQuery() ??
        this.searchService.queryString() ??
        reformatQueryToJustHaveProduct(
          this.storageService.retrieve('search-query')
        ) ??
        '';

      if (!this.query) {
        this.query = this.queryString ?? '';
      }

      this.tryChangeProductBasedOnQuery(this.query);
    });
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
  }

  doEnter(newText: string) {
    this.tryChangeProductBasedOnQuery(newText);
    this.enter.emit(this.emittedText());
  }

  changeText(newText: string) {
    if (this.hasFinishedGameThought(newText)) {
      this.tryChangeProductBasedOnQuery(newText);
    }

    this.debouncedTypeEmit();
  }

  hasFinishedGameThought(text: string) {
    return (text.match(/\bgame:"?([\w,]+)"? /gm)?.length ?? 0) > 0;
  }

  tryChangeProductBasedOnQuery(text: string) {
    if (!text.includes('game:')) return;

    const foundGame = getGameFromQuery(text) ?? '';
    if (this.metaService.getProductNameByProductId(foundGame)) {
      this.chosenProduct = foundGame;
    } else {
      this.chosenProduct = 'default';
    }

    this.query = removeGameFromQuery(text).trim();
  }

  changeProduct(productName: string) {
    if (
      productName !== 'default' &&
      !this.metaService.getProductNameByProductId(productName)
    )
      return;

    this.chosenProduct = productName;

    this.searchField.value = removeAllButBareTextAndGameFromQuery(
      this.searchField.value ?? ''
    );

    this.changeText(this.searchFieldValue);
  }

  private emittedText(): string {
    const baseText =
      this.chosenProduct && this.chosenProduct !== 'default'
        ? `game:${this.chosenProduct}`
        : '';
    return `${baseText} ${this.query}`.trim();
  }
}
