import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MenuEngagementComponent} from "./menu-engagement.component";

const routes: Routes = [
  {path: '', component: MenuEngagementComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuEngagementRoutingModule { }
