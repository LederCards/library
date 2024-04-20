import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetsPageRoutingModule } from './sets-routing.module';

import { SetsPage } from './sets.page';
import { SharedModule } from '../_shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    SetsPageRoutingModule
  ],
  declarations: [SetsPage]
})
export class SetsPageModule {}
