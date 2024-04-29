import { Component, inject, type OnInit } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';

import { marked } from 'marked';

import { type ICardHelp } from '../../../interfaces';

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

  formatText(text: string): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(marked.parse(text));
  }

  navigateTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      document.location.hash = id;
    }, 0);
  }
}
