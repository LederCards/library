import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgxDatatableModule } from '@siemens/ngx-datatable';

import { SearchPageRoutingModule } from './search-routing.module';

import { SharedModule } from '../_shared/shared.module';
import { SearchPage } from './search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxDatatableModule,
    SharedModule,
    SearchPageRoutingModule,
  ],
  declarations: [SearchPage],
})
export class SearchPageModule {}
