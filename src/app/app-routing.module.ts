import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './weche-space/auth.guard';

/**
 * Defines the routes configuration for the application.
 */
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./weche-space/portail/portail.module').then(m => m.PortailModule)
  },
  {
    path: 'backoffice',
    loadChildren: () => import('./weche-space/backoffice/backoffice.module').then(m => m.BackofficeModule),
    canActivate: [authGuard] // Requires authentication for accessing the 'backoffice' route
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
