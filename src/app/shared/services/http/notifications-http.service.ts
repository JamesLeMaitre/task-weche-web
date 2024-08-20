import { Injectable } from '@angular/core';
import {BaseHttpService} from "./base-http.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpResponse} from "../../models/http-response";
import {Structure} from "../../models/structure";
import {Notifications} from "../../models/notifications";

@Injectable({
  providedIn: 'root'
})
export class NotificationsHttpService extends BaseHttpService {

  /**
   * Represents a class that extends HttpInterceptor and provides an implementation of the intercept method.
   *
   * @property http - The HttpClient instance used for making HTTP requests.
   */
  constructor(
    private http: HttpClient
  ) {
    super();
  }

  /**
   * Retrieves a list of unread notifications.
   *
   * @returns An Observable that emits an HttpResponse containing an array of Notifications.
   */
  getListUnread(): Observable<HttpResponse<Notifications[]>> {
    return this.http.get<HttpResponse<Notifications[]>>(`${this.API_URL}/notifications/unread`, {
      headers: this.httpHeaders
    });
  }

  /**
   *  Reads a notification.
   *  @returns An Observable that emits an HttpResponse containing the read notification.
   * @param id
   */

  readNotification(id: string): Observable<HttpResponse<Notifications>> {
    return this.http.get<HttpResponse<Notifications>>(`${this.API_URL}/notifications/read/${id}`, {
      headers: this.httpHeaders
    });
  }
}
