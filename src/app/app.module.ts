import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoutesService } from './shared/services/routes.service';


import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {Network} from '@awesome-cordova-plugins/network/ngx';
// imports...
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import { IonIntlTelInputModule } from 'ion-intl-tel-input';

import {CarouselModule} from 'primeng/carousel';
import {ButtonModule} from 'primeng/button';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(), 
    AppRoutingModule,
    IonIntlTelInputModule,
    CarouselModule,
    NgbModule,
    ButtonModule,
    HttpClientModule, // <--- add this
    TranslateModule.forRoot({ // <--- add this
      loader: { // <--- add this
        provide: TranslateLoader, // <--- add this
        useFactory: (createTranslateLoader),  // <--- add this
        deps: [HttpClient] // <--- add this
      } // <--- add this
    }) // <--- add this
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    RoutesService,
    Network

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
