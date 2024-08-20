import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SharedModule} from "./shared/shared.module";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BaseInterceptorService} from "./shared/services/http/base-interceptor.service";
import {AuthService} from "./weche-space/portail/menu-connexion/services/auth.service";
import {   NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';


/**
 * Initializes the application with the user authentication service.
 *
 * @param {AuthService} authService - The authentication service.
 * @returns {() => Promise<void>} - A function that returns a promise.
 */
function appInitializer(authService: AuthService) {
  return () => {
    return new Promise((resolve) => {
      //@ts-ignore
      authService.getUserByToken().subscribe().add(resolve);
    });
  };
}

/**
 * Represents the root module of the application.
 */
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    NgbAlertModule,
    ReactiveFormsModule,
    NgbModule,
    NgxPaginationModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: BaseInterceptorService, multi: true },
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthService] }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
