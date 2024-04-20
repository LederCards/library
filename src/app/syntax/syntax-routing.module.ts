import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SyntaxPage } from './syntax.page';

const routes: Routes = [
  {
    path: '',
    component: SyntaxPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SyntaxPageRoutingModule {}
