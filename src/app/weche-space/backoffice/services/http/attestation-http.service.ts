import {Injectable} from '@angular/core';
import {BaseHttpService} from "../../../../shared/services/http/base-http.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpResponse} from "../../../../shared/models/http-response";
import {NewRequest} from "../../models/new-request";

@Injectable({
  providedIn: 'root'
})
export class AttestationHttpService extends BaseHttpService {

  constructor(
    private http: HttpClient
  ) {
    super()
  }

  save(request: FormData): Observable<HttpResponse<NewRequest>> {
    return this.http.post<HttpResponse<any>>(`${this.API_URL}/new-request`, request, {})
  }

  create(request: FormData): Observable<HttpResponse<NewRequest>> {
    return this.http.post<HttpResponse<any>>(`${this.API_URL}/new-request/create`, request, {})
  }
}
