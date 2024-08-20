import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import {AlloretraiteHttpService} from "./http/alloretraite-http.service";
import {Alloretraite} from "../models/alloretraite";
import {getFormEncodedData} from "../../../../shared/ts/main";
import {catchError, finalize, map} from "rxjs/operators";
import {HttpResponse} from "../../../../shared/models/http-response";

@Injectable({
  providedIn: 'root'
})
export class AlloretraiteService implements OnDestroy {
  // public fields
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private service: AlloretraiteHttpService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  sendRequest(request: { [p: string]: string }): Observable<Alloretraite | undefined> {
    this.isLoadingSubject.next(true);
    const formEncoded: URLSearchParams = getFormEncodedData(request);
    return this.service.send(formEncoded).pipe(
      map((response: HttpResponse<Alloretraite>) => response.data),
      catchError((err) => {
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

}
