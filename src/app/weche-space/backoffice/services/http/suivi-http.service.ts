import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpResponse} from "../../../../shared/models/http-response";

import { BaseHttpService } from "src/app/shared/services/http/base-http.service";
import { Injectable } from "@angular/core";
import { CheckRequestStatus } from "../../models/check-request-status";
import { NewRequest } from "../../models/new-request";
@Injectable({
  providedIn: 'root'
})export class SuiviHttpService extends BaseHttpService {

  constructor(
    private http: HttpClient
  ) {super()}

  getInfo(requestNumber: string): Observable<HttpResponse<CheckRequestStatus>> {
    return this.http.get<HttpResponse<CheckRequestStatus>>(`${this.API_URL}/check-request-status/search/${requestNumber}`, {
      headers: this.httpHeaders
    });
  }
  update1(id: string, request: FormData): Observable<HttpResponse<NewRequest>> {
    return this.http.post<HttpResponse<any>>(`${this.API_URL}/pending-request/update-file-appointment-decree/${id}`, request, {})
  }

  update(id: string, request: FormData): Observable<HttpResponse<NewRequest>> {
    return this.http.post<HttpResponse<any>>(`${this.API_URL}/pending-request/update-file/${id}`, request, {})

  }update2(id: string, request: FormData): Observable<HttpResponse<NewRequest>> {
    return this.http.post<HttpResponse<any>>(`${this.API_URL}/pending-request/update-file-handing-over/${id}`, request, {})
  }
}
