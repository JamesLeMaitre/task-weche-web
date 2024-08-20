import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {getJwtLocalDataStorage} from "../../ts/Utils";
import {environment} from "../../../../environment/environment";


@Injectable({
  providedIn: 'root'
})
export class BaseInterceptorService implements HttpInterceptor {
  /**
   * Intercepts HTTP requests and adds authorization headers if necessary.
   * If the request is not for authentication or registration, it adds an authorization header with the access token.
   * If the request fails with a 401 status, it retries the request with the refresh token.
   *
   * @param req - The HTTP request to intercept.
   * @param next - The next HTTP handler.
   * @returns An Observable that emits the HTTP event.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Log the URL of the request
    // console.log(`Sending request to ${req.url}`);

    // Check if the request is for authentication or registration
    const isAuthOrReg = [
      "/api/v1/login",
    ].some(url => req.url.endsWith(url));

    // If the request is for authentication or registration, pass it through without modifications
    if (isAuthOrReg) {
      return next.handle(req);
    } else {
      // Get the access token from local storage
      const authToken = getJwtLocalDataStorage(`${environment.appVersion}-${environment.USERDATA_KEY}`);

      // Clone the request and add the authorization header with the access token
      const authReq = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${authToken?.accessToken}`)
      });

      // Handle the request and catch any errors
      return next.handle(authReq).pipe(
        catchError((error) => {
          // Log the status code of the error
          console.log(error.status);

          // If the error is a 401, retry the request with the refresh token
          if (error.status === 401) {
            return next.handle(req);
          }

          // Throw the error if it is not a 401
          return throwError(error);
        })
      );
    }
  }
}
