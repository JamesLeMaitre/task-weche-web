import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import {AttestationHttpService} from "./http/attestation-http.service";
import {HttpResponse} from "../../../shared/models/http-response";
import {catchError, finalize, map} from "rxjs/operators";
import {NewRequest} from "../models/new-request";
import {getFormEncodedData} from "../../../shared/ts/main";

@Injectable({
  providedIn: 'root'
})
export class AttestationService implements OnDestroy {
  // public fields
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/


  constructor(
    private service: AttestationHttpService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  sendRequest(request: { [key: string]: string | Blob }): Observable<NewRequest | undefined> {
    this.isLoadingSubject.next(true);
    // const formEncoded: URLSearchParams = getFormEncodedData(request);
    const formData = new FormData();
    Object.keys(request).forEach((key: string) => {
      formData.append(key, request[key]);
    })
    // console.log("valeur du formData++++++", formData);
    return this.service.save(formData).pipe(
      map((response: HttpResponse<NewRequest>) => response.data),
      catchError((err) => {
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  

  createRequest(request: { [key: string]: string | Blob }): Observable<NewRequest | undefined> {
    this.isLoadingSubject.next(true);
    // const formEncoded: URLSearchParams = getFormEncodedData(request);
    const formData = new FormData();
    Object.keys(request).forEach((key: string) => {
      formData.append(key, request[key]);
    })

    return this.service.create(formData).pipe(
      map((response: HttpResponse<NewRequest>) => response.data),
      catchError((err) => {
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
