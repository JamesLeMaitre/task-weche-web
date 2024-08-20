import { Injectable } from '@angular/core';
import {BaseHttpService} from "../../../../../shared/services/http/base-http.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpResponse} from "../../../../../shared/models/http-response";

@Injectable({
  providedIn: 'root'
})
export class ContactHttpService extends BaseHttpService {

  constructor(
    private http: HttpClient
  ) {super()}

  sendMessage(request: URLSearchParams): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(`${this.API_URL}/contact`, request,{
      headers: this.httpHeaders.set("content-type", "application/x-www-form-urlencoded")
    })
  }
}
