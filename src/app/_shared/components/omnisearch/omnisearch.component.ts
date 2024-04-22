import { Component, effect, input, output } from '@angular/core';

@Component({
  selector: 'app-omnisearch',
  templateUrl: './omnisearch.component.html',
  styleUrls: ['./omnisearch.component.scss'],
})
export class OmnisearchComponent {
  public query = '';

  public big = input<boolean>(false);
  public initialQuery = input<string>('');
  public type = output<string>();
  public enter = output<string>();

  constructor() {
    effect(() => {
      this.query = this.initialQuery();
    });
  }
}
