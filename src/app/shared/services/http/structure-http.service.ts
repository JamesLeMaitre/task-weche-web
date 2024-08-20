import {Injectable} from '@angular/core';
import {BaseHttpService} from "./base-http.service";
import {HttpClient} from "@angular/common/http";
import {Structure} from "../../models/structure";
import {HttpResponse} from "../../models/http-response";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StructureHttpService extends BaseHttpService {

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
   * List all structures.
   * @returns An Observable that emits an HttpResponse containing an array of Structures.
   */
  getList(): Observable<HttpResponse<Structure[]>> {
    return this.http.get<HttpResponse<Structure[]>>(`${this.API_URL}/structure`, {
      headers: this.httpHeaders
    });
  }
}
