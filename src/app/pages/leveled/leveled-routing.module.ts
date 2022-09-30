import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeveledPage } from './leveled.page';

const routes: Routes = [
  {
    path: '',
    component: LeveledPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeveledPageRoutingModule {}
