import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MenuAlloretraiteComponent} from "./menu-alloretraite.component";

const routes: Routes = [
  {
    path: '',
    component: MenuAlloretraiteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuAlloretraiteRoutingModule { }
