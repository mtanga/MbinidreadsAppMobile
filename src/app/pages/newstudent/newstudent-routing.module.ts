import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewstudentPage } from './newstudent.page';

const routes: Routes = [
  {
    path: '',
    component: NewstudentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewstudentPageRoutingModule {}
