import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeveledPageRoutingModule } from './leveled-routing.module';

import { LeveledPage } from './leveled.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeveledPageRoutingModule
  ],
  declarations: [LeveledPage]
})
export class LeveledPageModule {}
