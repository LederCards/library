import { inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../environments/environment';
import { WINDOW } from './_shared/helpers';

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  private window = inject(WINDOW);
  private localStorageService = inject(LocalStorageService);

  private locale = signal<string>('en-US');
  private validLocales: string[] = [];

  public get allLocales() {
    if (!environment.production) {
      return [...this.validLocales, 'te-ST'];
    }
    return this.validLocales;
  }

  public get currentLocale() {
    return this.locale.asReadonly();
  }

  public async init() {
    this.locale.set(this.localStorageService.retrieve('locale') ?? 'en-US');

    const urlParams = new URLSearchParams(this.window.location.search);
    const setLocaleFromURL = urlParams.get('setlocale');
    if (setLocaleFromURL) {
      this.locale.set(setLocaleFromURL);
    }
  }

  public setLocales(locales: string[]) {
    this.validLocales = locales;
  }

  public changeLocale(locale: string) {
    this.locale.set(locale);
    this.localStorageService.store('locale', locale);
  }
}
