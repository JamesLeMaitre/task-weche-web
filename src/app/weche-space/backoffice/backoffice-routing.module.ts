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
