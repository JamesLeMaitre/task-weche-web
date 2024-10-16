import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackofficeComponent } from './backoffice.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { AideComponent } from './aide/aide.component';
import { DemandeComponent } from './demande/demande.component';
import { AttestationAppComponent } from './attestation-app/attestation-app.component';
import { DetailNommeComponent } from './detail-nomme/detail-nomme.component';
import { SuiviComponent } from './suivi/suivi.component';
import { authGuard } from '../auth.guard';
import { LigneCarriereComponent } from './ligne-carriere/ligne-carriere.component';
import { DemandeTraiterComponent } from './demande-traiter/demande-traiter.component';
import { AttestationNradiationComponent } from './attestation-nradiation/attestation-nradiation.component';
import { AttestationAvComponent } from './attestation-av/attestation-av.component';
import { DemandeInfosComponent } from './demande-infos/demande-infos.component';
import { SignalerComponent } from './signaler/signaler.component';


const routes: Routes = [
  {
    path: '',
    component: BackofficeComponent,
    children: [
      {
        path: '',
        component: DashbordComponent,
      },
      {
        path: 'detail-nomme/:paramKey',
        component: DetailNommeComponent,canActivate: [authGuard]
      },
      {
        path: 'suivi',
        component: SuiviComponent,
      },
      {
        path: 'signaler',
        component: SignalerComponent,
      },
      {
        path: 'demande-infos',
        component: DemandeInfosComponent,
      },  {
        path: 'non-radiation',
        component: AttestationNradiationComponent,
      },
      {
        path: 'attestation-validite',
        component: AttestationAvComponent,
      },
      {
        path: 'demande-app',
        component: AttestationAppComponent,
      },
      {
        path: 'dashbord',
        component: DashbordComponent,
      },
      {
        path: 'aide',
        component: AideComponent,
      }
      ,
      {
        path: 'ligne-carriere',
        component: LigneCarriereComponent,
      }  ,
      {
        path: 'demande-traiter',
        component: DemandeTraiterComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackofficeRoutingModule {}
