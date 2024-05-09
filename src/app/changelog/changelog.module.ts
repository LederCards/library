import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangelogPageRoutingModule } from './changelog-routing.module';

import { SharedModule } from '../_shared/shared.module';
import { ChangelogPage } from './changelog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ChangelogPageRoutingModule,
  ],
  declarations: [ChangelogPage],
})
export class ChangelogPageModule {}
