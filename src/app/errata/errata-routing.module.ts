import { NgModule } from '@angular/core';
import { type Routes, RouterModule } from '@angular/router';

import { ErrataPage } from './errata.page';

const routes: Routes = [
  {
    path: '',
    component: ErrataPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrataPageRoutingModule {}
