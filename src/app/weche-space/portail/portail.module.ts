import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortailRoutingModule } from './portail-routing.module';
import { PortailComponent } from './portail.component';
import {SharedModule} from "../../shared/shared.module";
import { AcceuilComponent } from './acceuil/acceuil.component';
import { DemandeAttestationComponent } from './demande-attestation/demande-attestation.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PortailComponent,
    AcceuilComponent,
    DemandeAttestationComponent,
    InscriptionComponent,
  ],
  imports: [
    CommonModule,
    PortailRoutingModule,
    SharedModule,ReactiveFormsModule
  ]
})
export class PortailModule { }
