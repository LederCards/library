import { Component, input } from '@angular/core';

@Component({
  selector: 'app-cardicon',
  templateUrl: './cardicon.component.html',
  styleUrls: ['./cardicon.component.scss'],
})
export class CardIconComponent {
  public size = input<number>(24);
  public type = input.required<string>();

  constructor() {}
}
