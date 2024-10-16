import { Injectable } from '@angular/core';
import {BaseHttpService} from "../../../../shared/services/http/base-http.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpResponse} from "../../../../shared/models/http-response";
import {Beneficiary} from "../../models/beneficiary";

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryHttpService extends BaseHttpService {

  constructor(
    private http: HttpClient
  ) {
    super()
  }

  getList(): Observable<HttpResponse<Beneficiary[]>> {
    return this.http.get<HttpResponse<Beneficiary[]>>(`${this.API_URL}/beneficiaries`, {
      headers: this.httpHeaders
    });
  }
}
