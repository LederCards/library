import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvancedPage } from './advanced.page';

const routes: Routes = [
  {
    path: '',
    component: AdvancedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvancedPageRoutingModule {}
