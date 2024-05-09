import { Component, inject, type OnInit } from '@angular/core';
import { LocalStorage } from 'ngx-webstorage';
import { LocaleService } from '../../../locale.service';
import { MetaService } from '../../../meta.service';

@Component({
  selector: 'app-below-the-fold',
  templateUrl: './below-the-fold.component.html',
  styleUrls: ['./below-the-fold.component.scss'],
})
export class BelowTheFoldComponent implements OnInit {
  public metaService = inject(MetaService);
  public localeService = inject(LocaleService);

  @LocalStorage() visualMode!: string;

  constructor() {}

  ngOnInit() {
    if (!this.visualMode) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.visualMode = prefersDark.matches ? 'dark' : 'light';
    }

    this.ensureThemeSet();
  }

  toggleMode() {
    this.visualMode = this.visualMode === 'light' ? 'dark' : 'light';
    this.ensureThemeSet();
  }

  ensureThemeSet() {
    const body = document.querySelector('body');
    if (!body) return;

    body.classList.remove('dark', 'light');
    body.classList.add(this.visualMode);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changeLocale($event: any) {
    this.localeService.changeLocale($event.detail.value);
  }
}
