import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetsPage } from './sets.page';

const routes: Routes = [
  {
    path: '',
    component: SetsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetsPageRoutingModule {}
