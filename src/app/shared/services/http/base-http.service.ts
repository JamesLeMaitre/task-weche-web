import { Injectable } from '@angular/core';
import {environment} from "../../../../environment/environment";
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BaseHttpService {
protected API_URL = environment.apiUrl;

  protected httpHeaders: HttpHeaders = new HttpHeaders({
    "accept": "application/json;charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  });

  protected httpHeader(): HttpHeaders {
    // Creating a new instance of HttpHeaders
    return new HttpHeaders()
      // Setting the accept header to "application/json; charset=utf-8"
      .set("accept", "application/json; charset=utf-8")
      // Setting the Access-Control-Allow-Origin header to "*"
      .set("Access-Control-Allow-Origin", "*");
  }
}
