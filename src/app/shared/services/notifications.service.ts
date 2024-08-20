import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import {Structure} from "../models/structure";
import {catchError, finalize, map} from "rxjs/operators";
import {NotificationsHttpService} from "./http/notifications-http.service";
import {Notifications} from "../models/notifications";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService implements OnDestroy {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  structure!: Structure[];
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(private service: NotificationsHttpService) {
    // Initialize isLoadingSubject with false
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);

    // Create an observable for isLoading
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this.unsubscribe.forEach((subscription) => subscription.unsubscribe());
  }

  listUnread(): Observable<Notifications[]> {
    // Set isLoadingSubject to true
    this.isLoadingSubject.next(true);

    return this.service.getListUnread().pipe(
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



  readNotification(id: string): Observable<Notifications | undefined> {
    // Set isLoadingSubject to true
    this.isLoadingSubject.next(true);

    return this.service.readNotification(id).pipe(
      // Extract data from response
      map(response => response.data),

      // Handle errors by returning undefined
      catchError((error) => {
        return of(undefined);
      }),

      // Set isLoadingSubject to false after completion
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
