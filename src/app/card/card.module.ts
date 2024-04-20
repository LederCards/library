import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CardPageRoutingModule } from './card-routing.module';

import { CardPage } from './card.page';
import { SharedModule } from '../_shared/shared.module';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    ClipboardModule,
    CardPageRoutingModule
  ],
  declarations: [CardPage]
})
export class CardPageModule {}
