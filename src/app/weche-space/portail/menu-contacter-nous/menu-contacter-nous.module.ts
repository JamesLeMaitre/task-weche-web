import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuContacterNousRoutingModule } from './menu-contacter-nous-routing.module';
import { MenuContacterNousComponent } from './menu-contacter-nous.component';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    MenuContacterNousComponent
  ],
    imports: [
        CommonModule,
        MenuContacterNousRoutingModule,
        ReactiveFormsModule
    ]
})
export class MenuContacterNousModule { }
