import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ErrataPageRoutingModule } from './errata-routing.module';

import { SharedModule } from '../_shared/shared.module';
import { ErrataPage } from './errata.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErrataPageRoutingModule,
    SharedModule,
  ],
  declarations: [ErrataPage],
})
export class ErrataPageModule {}
