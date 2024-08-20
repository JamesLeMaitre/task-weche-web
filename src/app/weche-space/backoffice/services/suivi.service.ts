import { Injectable } from '@angular/core';
import {HttpResponse} from "../../../shared/models/http-response";
import { BehaviorSubject , Observable, of, Subscription } from 'rxjs';
import { SuiviHttpService } from './http/suivi-http.service';

import {catchError, finalize, map} from "rxjs/operators";
import { CheckRequestStatus } from '../models/check-request-status';
import { NewRequest } from '../models/new-request';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SuiviService {
  // public fields
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/


  constructor(
    private service: SuiviHttpService,private http: HttpClient
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  infoSuivi(structureId: string): Observable<CheckRequestStatus| undefined> {
    this.isLoadingSubject.next(true);
    return this.service.getInfo(structureId).pipe(
      map(response => response.data),
      catchError((err) => {
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  update(id:string,request: { [key: string]: string | Blob }): Observable<NewRequest | undefined> {
    this.isLoadingSubject.next(true);
    // const formEncoded: URLSearchParams = getFormEncodedData(request);
    const formData = new FormData();
    Object.keys(request).forEach((key: string) => {
      formData.append(key, request[key]);
    })
    // console.log("valeur du formData++++++", formData);
    return this.service.update(id,formData).pipe(
      map((response: HttpResponse<NewRequest>) => response.data),
      catchError((err) => {
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
