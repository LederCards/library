import { InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken<Window>('WINDOW', {
  factory: () => (typeof window !== 'undefined' ? window : ({} as Window)),
});
