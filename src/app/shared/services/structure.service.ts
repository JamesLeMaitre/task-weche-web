import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import {StructureHttpService} from "./http/structure-http.service";
import {catchError, finalize, map} from "rxjs/operators";
import {Structure} from "../models/structure";

@Injectable({
  providedIn: 'root'
})
export class StructureService implements OnDestroy {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  structure!:Structure[];
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(private service: StructureHttpService) {
    // Initialize isLoadingSubject with false
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);

    // Create an observable for isLoading
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }


  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


  listStructure(): Observable<Structure[]> {
    // Set isLoadingSubject to true
    this.isLoadingSubject.next(true);

    return this.service.getList().pipe(
      // Extract data from response
      map(response => response.data),

      // Handle errors by returning an empty array
      catchError((error) => {
        return of([]);
      }),

      // Set isLoadingSubject to false after completion
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
