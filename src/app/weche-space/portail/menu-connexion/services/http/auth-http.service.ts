import { Injectable } from '@angular/core';
import {BaseHttpService} from "../../../../../shared/services/http/base-http.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpResponse} from "../../../../../shared/models/http-response";
import {UserJwt} from "../../models/user-jwt";
import {User} from "../../models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService extends BaseHttpService {

  constructor(
    private http: HttpClient
  ) {super()}
  login(request: URLSearchParams):Observable<HttpResponse<UserJwt>> {
    return this.http.post<HttpResponse<UserJwt>>(`${this.API_URL}/login`, request,{
      headers: this.httpHeaders.set("content-type", "application/x-www-form-urlencoded")
    })
  }
  register(request: URLSearchParams):Observable<HttpResponse<UserJwt>> {
    return this.http.post<HttpResponse<UserJwt>>(`${this.API_URL}/register`, request,{
      headers: this.httpHeaders.set("content-type", "application/x-www-form-urlencoded")
    })
  }
  me(request: URLSearchParams):Observable<HttpResponse<User>> {
    return this.http.post<HttpResponse<User>>(`${this.API_URL}/me`, request,{
      headers: this.httpHeaders.set("content-type", "application/x-www-form-urlencoded")
    })
  }

}
