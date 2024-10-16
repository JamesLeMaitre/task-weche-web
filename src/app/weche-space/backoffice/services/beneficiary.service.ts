import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import {BeneficiaryHttpService} from "./http/beneficiary-http.service";
import {NewRequest} from "../models/new-request";
import {catchError, finalize, map} from "rxjs/operators";
import {Beneficiary} from "../models/beneficiary";

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService implements OnDestroy {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private service: BeneficiaryHttpService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }


  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


  listBeneficiaries(): Observable<Beneficiary[] | []> {
    this.isLoadingSubject.next(true);
    return this.service.getList().pipe(
      map(response => response.data),
      catchError((err) => {
        return of([]);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
