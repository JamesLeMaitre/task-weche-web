import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, of, Subscription} from 'rxjs';
import {catchError, finalize, map, switchMap} from 'rxjs/operators';
import {User} from "../models/user";
import {environment} from "../../../../../environment/environment";
import {Router} from "@angular/router";
import {AuthHttpService} from "./http/auth-http.service";
import {getFormEncodedData} from "../../../../shared/ts/main";
import {UserJwt} from "../models/user-jwt";
import {HttpResponse} from "../../../../shared/models/http-response";
import {setLocalStorageData} from "../../../../shared/ts/Utils";


export type UserType = User | undefined;


@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // public fields
  currentUser$: Observable<UserType> ;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  constructor(
    private authHttpService: AuthHttpService,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  // public methods
  login(request: { [p: string]: string }): Observable<UserType> {
    this.isLoadingSubject.next(true);
    const formEncoded: URLSearchParams = getFormEncodedData(request);
    return this.authHttpService.login(formEncoded).pipe(
      map((response: HttpResponse<UserJwt>) => this.setAuthFromLocalStorage(response.data)),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout(): void {
    localStorage.removeItem(this.authLocalStorageToken);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<UserType> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.accessToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);

    return this.authHttpService.me(new URLSearchParams()).pipe(
      map((response: HttpResponse<UserType>) => {
        const user = response.data;
        if (user) {
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  // private methods
  private setAuthFromLocalStorage(auth: UserJwt): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.accessToken) {
      setLocalStorageData(this.authLocalStorageToken, JSON.stringify(auth));
      // localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  // public methods
  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }
  private getAuthFromLocalStorage(): UserJwt | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      return JSON.parse(lsValue);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
