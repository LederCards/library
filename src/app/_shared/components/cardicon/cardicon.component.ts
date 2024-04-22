import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cardicon',
  templateUrl: './cardicon.component.html',
  styleUrls: ['./cardicon.component.scss'],
})
export class CardIconComponent {
  @Input() size = 24;
  @Input() type = null;

  constructor() {}
}
