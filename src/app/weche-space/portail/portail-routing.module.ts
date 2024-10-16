import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PortailComponent} from "./portail.component";
import {AcceuilComponent} from "./acceuil/acceuil.component";
import {DemandeAttestationComponent} from "./demande-attestation/demande-attestation.component";
import { InscriptionComponent } from './inscription/inscription.component';
import { FaqComponent } from './faq/faq.component';
import { DocumentComponent } from './document/document.component';


const routes: Routes = [
  {
    path: '', component: PortailComponent,
    children: [
      {
        path: '',
        component: AcceuilComponent
      },
      {
        path: 'documents',
        component: DocumentComponent
      },
      {
        path: 'demande-attestation',
        component: DemandeAttestationComponent
      }
      ,
      {
        path: 'faq',
        component: FaqComponent
      },

      {
        path: 'inscription',
        component: InscriptionComponent
      },
      {
        path: 'alloretraite', loadChildren: () => import('./menu-alloretraite/menu-alloretraite.module').then(m => m.MenuAlloretraiteModule),
      },
      {
        path: 'connexion', loadChildren: () => import('./menu-connexion/menu-connexion.module').then(m => m.MenuConnexionModule),
      },
      {
        path: 'engagement', loadChildren: () => import('./menu-engagement/menu-engagement.module').then(m => m.MenuEngagementModule),
      },
      {
        path: 'contacter', loadChildren: () => import('./menu-contacter-nous/menu-contacter-nous.module').then(m => m.MenuContacterNousModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortailRoutingModule { }
