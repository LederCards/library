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
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      useFactory: (cardsService: CardsService) => async () => {
        await cardsService.init();
        return cardsService;
      },
      deps: [CardsService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (metaService: MetaService) => async () => {
        await metaService.init();
        return metaService;
      },
      deps: [MetaService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
