import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LuxonModule } from 'luxon-angular';
import { BelowTheFoldComponent } from './components/below-the-fold/below-the-fold.component';
import { CardDisplayComponent } from './components/card-display/card-display.component';
import { TopbarComponent } from './components/topbar/topbar.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { CardIconComponent } from './components/cardicon/cardicon.component';
import { SearchCardsComponent } from './components/search-cards/search-cards.component';

@NgModule({
  declarations: [
    CardDisplayComponent,
    CardIconComponent,
    BelowTheFoldComponent,
    TopbarComponent,
    SearchCardsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule,
    LuxonModule,
    NgxDatatableModule,
    NgSelectModule,
  ],
  exports: [
    CardDisplayComponent,
    CardIconComponent,
    BelowTheFoldComponent,
    TopbarComponent,
    SearchCardsComponent,
  ],
})
export class SharedModule {}
