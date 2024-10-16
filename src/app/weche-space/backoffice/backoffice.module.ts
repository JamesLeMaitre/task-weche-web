import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackofficeRoutingModule } from './backoffice-routing.module';
import { BackofficeComponent } from './backoffice.component';
import { MenuComponent } from './menu/menu.component';
import { PreferenceComponent } from './preference/preference.component';
import { DemandeComponent } from './demande/demande.component';
import { DemandeTraiterComponent } from './demande-traiter/demande-traiter.component';
import { LigneCarriereComponent } from './ligne-carriere/ligne-carriere.component';
import { AttestationAppComponent } from './attestation-app/attestation-app.component';
import { EngagementComponent } from './engagement/engagement.component';
import { AideComponent } from './aide/aide.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailNommeComponent } from './detail-nomme/detail-nomme.component';
import { NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SuiviComponent } from './suivi/suivi.component';
import {CustomDatePipePipe} from "../../shared/services/custom-date-pipe.pipe";
import { NgxPaginationModule } from 'ngx-pagination';
import { DocumentModalComponent } from './document-modal/document-modal.component';

import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { DocumentModal2Component } from './document-modal2/document-modal2.component';
import { HistoriqueComponent } from './historique/historique.component';
import { AttestationNradiationComponent } from './attestation-nradiation/attestation-nradiation.component';
import { AttestationAvComponent } from './attestation-av/attestation-av.component';
import { DemandeInfosComponent } from './demande-infos/demande-infos.component';
import { SignalerComponent } from './signaler/signaler.component';



@NgModule({
  declarations: [
    BackofficeComponent,
    MenuComponent,
    PreferenceComponent,
    DemandeComponent,
    DemandeTraiterComponent,
    LigneCarriereComponent,
    AttestationAppComponent,
    EngagementComponent,
    AideComponent,
    DashbordComponent,
    DetailNommeComponent,
    SuiviComponent,
    CustomDatePipePipe,
    DocumentModalComponent,
    DocumentModal2Component,
    HistoriqueComponent,
    AttestationNradiationComponent,
    AttestationAvComponent,
    DemandeInfosComponent,
    SignalerComponent

  ],
  imports: [
    CommonModule,
    BackofficeRoutingModule,NgxDocViewerModule,   FormsModule,
    ReactiveFormsModule,  NgbModule,NgbAlertModule,NgxPaginationModule,

  ]
})
export class BackofficeModule { }
