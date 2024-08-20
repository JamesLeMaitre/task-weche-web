import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import {ContactHttpService} from "./http/contact-http.service";
import {getFormEncodedData} from "../../../../shared/ts/main";
import {catchError, finalize, map, switchMap} from "rxjs/operators";
import {HttpResponse} from "../../../../shared/models/http-response";
import {Contact} from "../models/contact";

@Injectable({
  providedIn: 'root'
})
export class ContactService implements OnDestroy{
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private service: ContactHttpService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  sendMessage(request: { [p: string]: string }): Observable<Contact | undefined> {
    this.isLoadingSubject.next(true);
    const formEncoded: URLSearchParams = getFormEncodedData(request);
    return this.service.sendMessage(formEncoded).pipe(
     map((response: HttpResponse<Contact>) => response.data),
      catchError((err) => {
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
