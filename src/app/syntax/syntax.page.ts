import { Component, inject, type OnInit } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';

import { marked } from 'marked';

import { type ICardHelp } from '../../../interfaces';

import { TranslateService } from '@ngx-translate/core';
import {
  cardDescription,
  nameDescription,
  productDescription,
  subproductDescription,
  tagDescription,
} from '../../../search/operators';

@Component({
  selector: 'app-syntax',
  templateUrl: './syntax.page.html',
  styleUrls: ['./syntax.page.scss'],
})
export class SyntaxPage implements OnInit {
  private domSanitizer = inject(DomSanitizer);
  private translateService = inject(TranslateService);

  public allOperators: ICardHelp[] = [
    cardDescription,
    nameDescription,
    productDescription,
    subproductDescription,
    tagDescription,
  ];

  ngOnInit() {
    if (document.location.hash) {
      setTimeout(() => {
        this.navigateTo(document.location.hash.replace('#', ''));
      }, 500);
    }
  }

  formatText(key: string): SafeHtml {
    const text = this.translateService.instant(key);

    return this.domSanitizer.bypassSecurityTrustHtml(marked.parse(text));
  }

  navigateTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      document.location.hash = id;
    }, 0);
  }
}
