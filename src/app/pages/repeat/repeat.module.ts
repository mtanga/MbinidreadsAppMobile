import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RepeatPageRoutingModule } from './repeat-routing.module';

import { RepeatPage } from './repeat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RepeatPageRoutingModule
  ],
  declarations: [RepeatPage]
})
export class RepeatPageModule {}
