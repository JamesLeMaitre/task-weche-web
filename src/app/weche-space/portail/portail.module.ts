import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortailRoutingModule } from './portail-routing.module';
import { PortailComponent } from './portail.component';
import {SharedModule} from "../../shared/shared.module";
import { AcceuilComponent } from './acceuil/acceuil.component';
import { DemandeAttestationComponent } from './demande-attestation/demande-attestation.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaqComponent } from './faq/faq.component';
import { DocumentComponent } from './document/document.component';


@NgModule({
  declarations: [
    PortailComponent,
    AcceuilComponent,
    DemandeAttestationComponent,
    InscriptionComponent,
    FaqComponent,
    DocumentComponent,
  ],
  imports: [
    CommonModule,
    PortailRoutingModule,FormsModule ,
    SharedModule,ReactiveFormsModule
  ]
})
export class PortailModule { }
