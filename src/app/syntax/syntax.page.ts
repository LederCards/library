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
  textDescription,
} from '../../../search/operators';
import { navigateTo, tryNavigateToHash } from '../_shared/helpers';

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
    textDescription,
    nameDescription,
    productDescription,
    subproductDescription,
    tagDescription,
  ];

  ngOnInit() {
    tryNavigateToHash();
  }

  formatText(key: string): SafeHtml {
    const text = this.translateService.instant(key);

    return this.domSanitizer.bypassSecurityTrustHtml(marked.parse(text));
  }

  navigateTo(id: string) {
    navigateTo(id);
  }
}
