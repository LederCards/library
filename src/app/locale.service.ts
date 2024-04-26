import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  private locale = signal<string>('en-US');

  public get currentLocale() {
    return this.locale.asReadonly();
  }

  public async init() {}
}
