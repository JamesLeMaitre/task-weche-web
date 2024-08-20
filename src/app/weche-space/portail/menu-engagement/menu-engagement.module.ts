import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuEngagementRoutingModule } from './menu-engagement-routing.module';
import { MenuEngagementComponent } from './menu-engagement.component';


@NgModule({
  declarations: [
    MenuEngagementComponent
  ],
  imports: [
    CommonModule,
    MenuEngagementRoutingModule
  ]
})
export class MenuEngagementModule { }
