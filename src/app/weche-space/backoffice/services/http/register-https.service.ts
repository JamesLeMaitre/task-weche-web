import {Injectable} from '@angular/core';
import {BaseHttpService} from "../../../../shared/services/http/base-http.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpResponse} from "../../../../shared/models/http-response";

import { Register } from '../../models/register';

@Injectable({
  providedIn: 'root'
})
export class RegisterHttpService extends BaseHttpService {

  constructor(
    private http: HttpClient
  ) {
    super()
  }



  soumettre(request: URLSearchParams): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(`${this.API_URL}/register`, request, {
      headers: this.httpHeader().set("content-Type", "application/x-www-form-urlencoded")
    })
  }
}
