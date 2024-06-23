import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SEOService {
  private pageMeta = inject(Meta);
  private title = inject(Title);
  private document = inject(DOCUMENT);

  public updatePageLanguage(lang: string): void {
    this.document.documentElement.lang = lang;
  }

  public updateOGTitle(newTitle: string): void {
    this.pageMeta.updateTag({ property: 'og:title', content: newTitle });
  }

  public updateOGImage(newImage: string): void {
    this.pageMeta.updateTag({ property: 'og:image', content: newImage });
  }

  public updateOGDescription(newDesc: string): void {
    this.pageMeta.updateTag({
      property: 'og:description',
      content: newDesc,
    });
  }

  public updateOGURL(newURL: string): void {
    this.pageMeta.updateTag({
      property: 'og:url',
      content: newURL,
    });
  }

  public updatePageTitle(newTitle: string): void {
    this.title.setTitle(newTitle);
  }

  public updateMetaDescription(newDesc: string): void {
    this.pageMeta.updateTag({
      name: 'description',
      content: newDesc,
    });
  }

  public makePageIndexable() {
    this.pageMeta.removeTag('property="robots"');
  }

  public makePageUnindexable() {
    this.pageMeta.addTag({ property: 'robots', content: 'noindex' });
  }
}
