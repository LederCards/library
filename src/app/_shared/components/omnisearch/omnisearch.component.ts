import { Component, effect, input, output, ViewChild } from '@angular/core';
import { IonSearchbar } from '@ionic/angular';

@Component({
  selector: 'app-omnisearch',
  templateUrl: './omnisearch.component.html',
  styleUrls: ['./omnisearch.component.scss'],
})
export class OmnisearchComponent {
  @ViewChild(IonSearchbar) searchField!: IonSearchbar;

  public query = '';

  public big = input<boolean>(false);
  public initialQuery = input<string>('');
  public type = output<string>();
  public enter = output<string>();

  public get searchFieldValue(): string {
    return this.searchField.value ?? '';
  }

  constructor() {
    effect(() => {
      this.query = this.initialQuery();
    });
  }
}
