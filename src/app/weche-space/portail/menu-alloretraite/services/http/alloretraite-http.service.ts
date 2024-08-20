import { Injectable } from '@angular/core';
import {BaseHttpService} from "../../../../../shared/services/http/base-http.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpResponse} from "../../../../../shared/models/http-response";
import {Alloretraite} from "../../models/alloretraite";

@Injectable({
  providedIn: 'root'
})
export class AlloretraiteHttpService extends BaseHttpService {

  constructor(
    private http: HttpClient
  ) {super()}
  send(request: URLSearchParams): Observable<HttpResponse<Alloretraite>> {
    return this.http.post<HttpResponse<Alloretraite>>(`${this.API_URL}/hello-retirement`, request,{
      headers: this.httpHeaders.set("content-type", "application/x-www-form-urlencoded")
    })
  }
}
