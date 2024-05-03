import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgxDatatableModule } from '@siemens/ngx-datatable';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardsService } from './cards.service';
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
    NgxDatatableModule,
    NgxWebstorageModule.forRoot(),
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [MetaService, LocaleService, FAQService, CardsService],
      useFactory:
        (
          metaService: MetaService,
          localeService: LocaleService,
          faqService: FAQService,
          cardsService: CardsService
        ) =>
        async () => {
          await metaService.init();
          await localeService.init();
          await faqService.init();
          await cardsService.init();
        },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
