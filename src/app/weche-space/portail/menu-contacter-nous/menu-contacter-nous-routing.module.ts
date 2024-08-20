import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MenuContacterNousComponent} from "./menu-contacter-nous.component";

const routes: Routes = [
  {path: '', component: MenuContacterNousComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuContacterNousRoutingModule { }
