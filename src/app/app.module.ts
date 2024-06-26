import { APP_INITIALIZER, NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { forkJoin } from 'rxjs';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardsService } from './cards.service';
import { ChangelogService } from './changelog.service';
import { ErrataService } from './errata.service';
import { FAQService } from './faq.service';
import { LocaleService } from './locale.service';
import { MetaService } from './meta.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ClipboardModule,
    NgxWebstorageModule.forRoot(),
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production && !environment.ssg,
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [
        MetaService,
        LocaleService,
        FAQService,
        ErrataService,
        ChangelogService,
        CardsService,
      ],
      useFactory:
        (
          metaService: MetaService,
          localeService: LocaleService,
          faqService: FAQService,
          errataService: ErrataService,
          changelogService: ChangelogService,
          cardsService: CardsService
        ) =>
        async () => {
          return forkJoin([
            metaService.init(),
            localeService.init(),
            faqService.init(),
            errataService.init(),
            changelogService.init(),
            cardsService.init(),
          ]);
        },
    },
    provideClientHydration(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
