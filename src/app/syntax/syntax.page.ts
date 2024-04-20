import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { marked } from 'marked';

import { ICardHelp } from '../../../interfaces';

import { abilityDescription, attributeDescription, cardDescription,
  colorDescription, costDescription, expansionDescription, flavorDescription, inDescription, levelDescription,
  nameDescription, powerDescription, rarityDescription, releaseDescription,
  setDescription, sideDescription, soulDescription, tagDescription, triggerDescription,
  typeDescription
} from '../../../search/operators';

@Component({
  selector: 'app-syntax',
  templateUrl: './syntax.page.html',
  styleUrls: ['./syntax.page.scss'],
})
export class SyntaxPage implements OnInit {

  public allOperators: ICardHelp[] = [
    abilityDescription,
    attributeDescription, cardDescription, colorDescription,
    costDescription, expansionDescription, flavorDescription,
    levelDescription,
    inDescription,
    nameDescription, powerDescription, rarityDescription,
    releaseDescription, setDescription, sideDescription,
    soulDescription, tagDescription, triggerDescription,
    typeDescription
  ];

  constructor(
    private router: Router,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    if(document.location.hash) {
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
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      document.location.hash = id;
    }, 0);
  }

}
