import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuAlloretraiteRoutingModule } from './menu-alloretraite-routing.module';
import { MenuAlloretraiteComponent } from './menu-alloretraite.component';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    MenuAlloretraiteComponent
  ],
    imports: [
        CommonModule,
        MenuAlloretraiteRoutingModule,
        ReactiveFormsModule
    ]
})
export class MenuAlloretraiteModule { }
