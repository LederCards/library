import { inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  private localStorageService = inject(LocalStorageService);

  private locale = signal<string>('en-US');
  private validLocales: string[] = [];

  public get allLocales() {
    return this.validLocales;
  }

  public get currentLocale() {
    return this.locale.asReadonly();
  }

  public async init() {
    this.locale.set(this.localStorageService.retrieve('locale') ?? 'en-US');
  }

  public setLocales(locales: string[]) {
    this.validLocales = locales;
  }

  public changeLocale(locale: string) {
    this.locale.set(locale);
    this.localStorageService.store('locale', locale);
  }
}
