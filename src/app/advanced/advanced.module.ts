import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdvancedPageRoutingModule } from './advanced-routing.module';

import { AdvancedPage } from './advanced.page';
import { SharedModule } from '../_shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    NgSelectModule,
    IonicModule,
    AdvancedPageRoutingModule
  ],
  declarations: [AdvancedPage]
})
export class AdvancedPageModule {}
