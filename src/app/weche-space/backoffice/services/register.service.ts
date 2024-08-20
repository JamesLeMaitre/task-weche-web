import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, map, Observable, of, Subscription } from 'rxjs';
import { RegisterHttpService } from './http/register-https.service';
import { getFormEncodedData } from 'src/app/shared/ts/main';
import { Register } from '../models/register';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  constructor(
    private service: RegisterHttpService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  soumettre(request: { [p: string]: string }): Observable<any | undefined> {
  this.isLoadingSubject.next(true);
  const formEncoded: URLSearchParams = getFormEncodedData(request);
  return this.service.soumettre(formEncoded).pipe(
    map((response) => response),
    catchError((err) => {

      return of(err.error);
    }),
    finalize(() => this.isLoadingSubject.next(false))
  )
}
}
