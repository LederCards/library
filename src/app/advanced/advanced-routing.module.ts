import { NgModule } from '@angular/core';
import { type Routes, RouterModule } from '@angular/router';

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
