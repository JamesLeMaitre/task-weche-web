import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, first, Observable, of, Subscription} from "rxjs";
import {DashbordHttpService} from "./http/dashbord-http.service";
import {catchError, finalize, map} from "rxjs/operators";
import {NewRequest} from "../models/new-request";
import {getFormEncodedData, getResult} from "../../../shared/ts/main";
import {CheckRequestStatus} from "../models/check-request-status";
import { UpdateRequest } from '../models/update-request';

@Injectable({
  providedIn: 'root'
})
export class DashboardService implements OnDestroy {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  demandes!: NewRequest[];
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private service: DashbordHttpService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


  listDemandes(structureId: string): Observable<NewRequest[]> {
    this.isLoadingSubject.next(true);
    return this.service.getList(structureId).pipe(
      map(response => response.data),
      catchError((err) => {
        return of([]);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  requestListSupAdmin(structureId: string): Observable<NewRequest[]> {
    this.isLoadingSubject.next(true);
    return this.service.getRequestListAdmin(structureId).pipe(
      map(response => response.data),
      catchError((err) => {
        return of([]);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  getAdminRequestDetail(id: string): Observable<NewRequest | undefined> {
    this.isLoadingSubject.next(true);
    return this.service.getAdminRequestDetail(id).pipe(
      map(response => response.data),
      catchError((err) => {
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  searchAdmin(search: string): Observable<CheckRequestStatus[]> {
    this.isLoadingSubject.next(true);
    return this.service.searchAdmin(search).pipe(
      map((response) => response.data),
      catchError((err) => {
        return of([]);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  getRequestDetailBySupAdmin(id: string): Observable<NewRequest | undefined> {
    this.isLoadingSubject.next(true);
    return this.service.getSupAdminDetail(id).pipe(
      map(response => response.data),
      catchError((err) => {
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  showRejectRequestUser(requestNumber: string): Observable<NewRequest | undefined> {
    this.isLoadingSubject.next(true);
    return this.service.showRejectRequestUser(requestNumber).pipe(
      map(response => response.data),
      catchError((err) => {
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  countRejectRequest(): Observable<number> {
    this.isLoadingSubject.next(true);
    return this.service.countRejectRequest().pipe(
      map((response) => response.data),
      catchError((err) => {
        return of(0);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  countNewRequest(): Observable<number> {
    this.isLoadingSubject.next(true);
    return this.service.countNewRequest().pipe(
      map((response) => response.data),
      catchError((err) => {
        return of(0);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  countPendingRequest(): Observable<number> {
    this.isLoadingSubject.next(true);
    return this.service.countPendingRequest().pipe(
      map((response) => response.data),
      catchError((err) => {
        return of(0);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  countApprovedRequest(): Observable<number> {
    this.isLoadingSubject.next(true);
    return this.service.countApprovedRequest().pipe(
      map((response) => response.data),
      catchError((err) => {
        return of(0);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listNewRequest(structureId: string): Observable<NewRequest[]> {
    this.isLoadingSubject.next(true);
    return this.service.listNewRequest(structureId).pipe(
      map((response) => response.data),
      catchError((err) => {
        return of([]);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  approveRequest(id: string): Observable<NewRequest | undefined> {
    this.isLoadingSubject.next(true);
    return this.service.approveRequestAdmin(id).pipe(
      map((response) => response.data),
      catchError((err) => {
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  approvedThirdRequest(id: string): Observable<NewRequest | undefined> {
    this.isLoadingSubject.next(true);
    return this.service.approveRequestByThird(id).pipe(
      map((response) => response.data),
      catchError((err) => {
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  approveSupAdminRequest(id: string): Observable<NewRequest | undefined> {
    this.isLoadingSubject.next(true);
    return this.service.approveRequestSupAdmin(id).pipe(
      map((response) => response.data),
      catchError((err) => {
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  getCheckStatus(request: string): Observable<CheckRequestStatus | undefined> {
    this.isLoadingSubject.next(true);
    return this.service.checkStatus(request).pipe(
      map((response) => response.data),
      catchError((err) => {
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }


  rejectRequestAdmin(request: { [p: string]: string }): Observable<NewRequest | undefined> {
    this.isLoadingSubject.next(true);
    const formEncoded: URLSearchParams = getFormEncodedData(request);
    return this.service.rejectRequestAdmin(formEncoded).pipe(
      map((response) => response.data),
      catchError((err) => {
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    )
  }

  rejectSupAdminRequest(request: { [p: string]: string }): Observable<NewRequest | undefined> {
    this.isLoadingSubject.next(true);
    const formEncoded: URLSearchParams = getFormEncodedData(request);
    return this.service.rejectSupAdminRequest(formEncoded).pipe(
      map((response) => response.data),
      catchError((err) => {
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    )
  }



  updateRequestBySupAdmin(request: { [p: string]: string }): Observable<NewRequest | undefined> {
    this.isLoadingSubject.next(true);
    const formEncoded: URLSearchParams = getFormEncodedData(request);
    return this.service.updateRequestBySupAdmin(formEncoded).pipe(
      map((response) => response.data),
      catchError((err) => {
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    )
  }

  updateRequestByAdmin(request: { [p: string]: string }): Observable<NewRequest | undefined> {
    this.isLoadingSubject.next(true);
    const formEncoded: URLSearchParams = getFormEncodedData(request);
    return this.service.updateRequestByAdmin(formEncoded).pipe(
      map((response) => response.data),
      catchError((err) => {
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    )
  }

  showFileToUpdate(requestNumber: string): Observable<UpdateRequest | undefined> {
    this.isLoadingSubject.next(true);
    return this.service.showFileToUpdate(requestNumber).pipe(
      map((response) => response.data),
      catchError((err) => {
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    )
  }

  checkStatusList(id: string): Observable<CheckRequestStatus[]> {
    this.isLoadingSubject.next(true);
    return this.service.checkStatusList(id).pipe(
      map((response) => response.data),
      catchError((err) => {
        return of([]);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  checkStatusListAdmin(id: string): Observable<CheckRequestStatus[]> {
    this.isLoadingSubject.next(true);
    return this.service.checkStatusListAdmin(id).pipe(
      map((response) => response.data),
      catchError((err) => {
        return of([]);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  checkStatusListDpaf(id: string): Observable<CheckRequestStatus[]> {
    this.isLoadingSubject.next(true);
    return this.service.checkStatusListDpaf(id).pipe(
      map((response) => response.data),
      catchError((err) => {
        return of([]);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listApprovedRejectedRequest(): Observable<CheckRequestStatus[]> {
    this.isLoadingSubject.next(true);
    return this.service.listApprovedRejected().pipe(
      map((response) => response.data),
      catchError((err) => {
        return of([]);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  nonRadiation(): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.service.nonRadiation().pipe(
      map((response) => response.data),
      catchError((err) => {
        return of([]);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  checkIfUserHasValidAppAndDnr(): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.service.checkIfUserHasValidAppAndDnr().pipe(
      map((response) => response.data),
      catchError((err) => {
        return of([]);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  checkIfUserHasValidApp(): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.service.checkIfUserHasValidApp().pipe(
      map((response) => response.data),
      catchError((err) => {
        return of([]);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  showRequest(requestNumber: string): Observable<NewRequest | undefined> {
    this.isLoadingSubject.next(true);
    return this.service.showRequest(requestNumber).pipe(
      map((response) => response.data),
      catchError((err) => {
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }


}
