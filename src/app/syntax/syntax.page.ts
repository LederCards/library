import { Component, inject, type OnInit } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { marked } from 'marked';

import { type ICardHelp } from '../../../interfaces';

import {
  cardDescription,
  inDescription,
  nameDescription,
  tagDescription,
} from '../../../search/operators';

@Component({
  selector: 'app-syntax',
  templateUrl: './syntax.page.html',
  styleUrls: ['./syntax.page.scss'],
})
export class SyntaxPage implements OnInit {
  private router = inject(Router);
  private domSanitizer = inject(DomSanitizer);

  public allOperators: ICardHelp[] = [
    cardDescription,
    inDescription,
    nameDescription,
    tagDescription,
  ];

  ngOnInit() {
    if (document.location.hash) {
      setTimeout(() => {
        this.navigateTo(document.location.hash.replace('#', ''));
      }, 500);
    }
  }

  search(query: string) {
    this.router.navigate(['/search'], { queryParams: { q: query } });
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
