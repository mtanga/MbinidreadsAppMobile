import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClasseroomPageRoutingModule } from './classeroom-routing.module';

import { ClasseroomPage } from './classeroom.page';

// other imports...
import {  HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClasseroomPageRoutingModule,
                        // other stuff...
                        TranslateModule.forChild({
                          loader: {
                            provide: TranslateLoader,
                            useFactory: createTranslateLoader,
                            deps: [HttpClient]
                          }
                        })
  ],
  declarations: [ClasseroomPage]
})
export class ClasseroomPageModule {}
