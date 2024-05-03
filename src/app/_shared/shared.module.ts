import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NgxDatatableModule } from '@siemens/ngx-datatable';
import { LuxonModule } from 'luxon-angular';
import { BelowTheFoldComponent } from './components/below-the-fold/below-the-fold.component';
import { CardDisplayComponent } from './components/card-display/card-display.component';
import { TopbarComponent } from './components/topbar/topbar.component';

import { HttpClient } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../../environments/environment';
import { CardTextComponent } from './components/card-text/card-text.component';
import { CardIconComponent } from './components/cardicon/cardicon.component';
import { OmnisearchComponent } from './components/omnisearch/omnisearch.component';
import { SearchCardsComponent } from './components/search-cards/search-cards.component';
import { FaqPipe } from './pipes/faq.pipe';
import { StripSpacesPipe } from './pipes/stripspaces.pipe';

export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `${environment.baseUrl}/i18n/`, '.json');
}

@NgModule({
  declarations: [
    CardDisplayComponent,
    CardIconComponent,
    BelowTheFoldComponent,
    TopbarComponent,
    SearchCardsComponent,
    OmnisearchComponent,
    CardTextComponent,
    FaqPipe,
    StripSpacesPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule,
    LuxonModule,
    NgxDatatableModule,
    NgSelectModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en-US',
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [
    CardDisplayComponent,
    CardIconComponent,
    BelowTheFoldComponent,
    TopbarComponent,
    SearchCardsComponent,
    OmnisearchComponent,
    CardTextComponent,
    FaqPipe,
    StripSpacesPipe,
    TranslateModule,
  ],
})
export class SharedModule {}
