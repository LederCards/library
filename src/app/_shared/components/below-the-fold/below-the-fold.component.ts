import { DOCUMENT } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { LocalStorage } from 'ngx-webstorage';
import { LocaleService } from '../../../locale.service';
import { MetaService } from '../../../meta.service';
import { WINDOW } from '../../helpers';

@Component({
  selector: 'app-below-the-fold',
  templateUrl: './below-the-fold.component.html',
  styleUrls: ['./below-the-fold.component.scss'],
})
export class BelowTheFoldComponent implements OnInit {
  public metaService = inject(MetaService);
  public localeService = inject(LocaleService);
  private window = inject(WINDOW);
  private document = inject(DOCUMENT);

  @LocalStorage() visualMode!: string;

  constructor() {}

  ngOnInit() {
    if (!this.visualMode) {
      const prefersDark =
        this.window.matchMedia?.('(prefers-color-scheme: dark)') ?? true;
      this.visualMode = prefersDark.matches ? 'dark' : 'light';
    }

    this.ensureThemeSet();
  }

  toggleMode() {
    this.visualMode = this.visualMode === 'light' ? 'dark' : 'light';
    this.ensureThemeSet();
  }

  ensureThemeSet() {
    const body = this.document.querySelector('body');
    if (!body) return;

    body.classList.remove('dark', 'light');
    body.classList.add(this.visualMode);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changeLocale($event: any) {
    this.localeService.changeLocale($event.detail.value);
  }
}
