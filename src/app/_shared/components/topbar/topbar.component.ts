import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  public title = input<string>('');
  public showSearch = input<boolean>(true);
  public query = input<string>('');

  public type = output<string>();
  public enter = output<string>();
}
