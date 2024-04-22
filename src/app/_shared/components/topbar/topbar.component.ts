import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  @Input() query = '';
  @Input() showSearch = true;
  @Input() title = '';
  @Output() type = new EventEmitter<string>();
  @Output() enter = new EventEmitter<string>();
}
