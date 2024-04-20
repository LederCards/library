import { Component, OnInit } from '@angular/core';
import { LocalStorage } from 'ngx-webstorage';

@Component({
  selector: 'app-below-the-fold',
  templateUrl: './below-the-fold.component.html',
  styleUrls: ['./below-the-fold.component.scss'],
})
export class BelowTheFoldComponent implements OnInit {

  @LocalStorage() visualMode = '';

  constructor() { }

  ngOnInit() {
    if(!this.visualMode) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.visualMode = prefersDark.matches ? 'dark' : 'light';
    }

    this.ensureThemeSet();
  }

  toggleMode() {
    this.visualMode = this.visualMode === 'light' ? 'dark' : 'light';
    this.ensureThemeSet();
  }

  ensureThemeSet() {
    const body = document.querySelector('body');
    body.classList.remove('dark', 'light');
    body.classList.add(this.visualMode);
  }

}
