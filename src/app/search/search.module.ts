import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { SharedModule } from '../_shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxDatatableModule,
    SharedModule,
    SearchPageRoutingModule
  ],
  declarations: [SearchPage]
})
export class SearchPageModule {}
