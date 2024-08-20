import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuConnexionRoutingModule } from './menu-connexion-routing.module';
import { MenuConnexionComponent } from './menu-connexion.component';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    MenuConnexionComponent
  ],
    imports: [
        CommonModule,
        MenuConnexionRoutingModule,
        ReactiveFormsModule
    ]
})
export class MenuConnexionModule { }
