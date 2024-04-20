import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cardicon',
  templateUrl: './cardicon.component.html',
  styleUrls: ['./cardicon.component.scss'],
})
export class CardIconComponent implements OnInit {
  @Input() size = 24;
  @Input() type = null;

  constructor() {}

  ngOnInit() {}
}
