import {Injectable} from '@angular/core';
import {BaseHttpService} from "../../../../shared/services/http/base-http.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpResponse} from "../../../../shared/models/http-response";
import {NewRequest} from "../../models/new-request";
import {CheckRequestStatus} from "../../models/check-request-status";
import {saveAs} from "file-saver";

/*function saveAs(blob: Blob, pdf: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.setAttribute('style', 'display: none');
  a.href = url;
  a.download = pdf;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}*/
import { UpdateRequest } from '../../models/update-request';

@Injectable({
  providedIn: 'root'
})
export class DashbordHttpService extends BaseHttpService {
  errorMessage!: string;

  constructor(
    private http: HttpClient
  ) {
    super()
  }

  getList(structureId: string): Observable<HttpResponse<NewRequest[]>> {
    return this.http.get<HttpResponse<NewRequest[]>>(`${this.API_URL}/new-request/list-by-structure/${structureId}`, {
      headers: this.httpHeaders
    });
  }

  getRequestListAdmin(structureId: string): Observable<HttpResponse<NewRequest[]>> {
    return this.http.get<HttpResponse<NewRequest[]>>(`${this.API_URL}/pending-request/list-by-structure/${structureId}`, {
      headers: this.httpHeaders
    });
  }
searchAdmin(search: string): Observable<HttpResponse<CheckRequestStatus[]>> {
    return this.http.get<HttpResponse<CheckRequestStatus[]>>(`${this.API_URL}/check-request-status/search-from-user/${search}`, {
      headers: this.httpHeaders
    });
  }
  getAdminRequestDetail(id: string): Observable<HttpResponse<NewRequest>> {
    return this.http.get<HttpResponse<NewRequest>>(`${this.API_URL}/new-request/${id}`, {
      headers: this.httpHeaders
    });
  }

  getSupAdminDetail(id: string): Observable<HttpResponse<NewRequest>> {
    return this.http.get<HttpResponse<NewRequest>>(`${this.API_URL}/pending-request/show/${id}`, {
      headers: this.httpHeaders
    });
  }

  showRejectRequestUser(requestNumber: string): Observable<HttpResponse<NewRequest>> {
    return this.http.get<HttpResponse<NewRequest>>(`${this.API_URL}/reject-request/show/${requestNumber}`, {
      headers: this.httpHeaders
    });
  }


  countRejectRequest(): Observable<HttpResponse<number>> {
    return this.http.get<HttpResponse<number>>(`${this.API_URL}/reject-request/count`, {
      headers: this.httpHeader()
    });
  }

  countNewRequest(): Observable<HttpResponse<number>> {
    return this.http.get<HttpResponse<number>>(`${this.API_URL}/new-request/count`, {
      headers: this.httpHeader()
    });
  }

  countPendingRequest(): Observable<HttpResponse<number>> {
    return this.http.get<HttpResponse<number>>(`${this.API_URL}/pending-request/count`, {
      headers: this.httpHeader()
    });
  }

  countApprovedRequest(): Observable<HttpResponse<number>> {
    return this.http.get<HttpResponse<number>>(`${this.API_URL}/approved-request/count`, {
      headers: this.httpHeader()
    });
  }

  listNewRequest(structureId: string): Observable<HttpResponse<NewRequest[]>> {
    return this.http.get<HttpResponse<NewRequest[]>>(`${this.API_URL}/new-request/list-by-structure/${structureId}`, {
      headers: this.httpHeaders

    });
  }


  approveRequestAdmin(id: string): Observable<HttpResponse<NewRequest>> {
    return this.http.get<HttpResponse<NewRequest>>(`${this.API_URL}/pending-request/${id}`, {
      headers: this.httpHeaders
    });
  }

  approveRequestByThird(id: string): Observable<HttpResponse<NewRequest>> {
    return this.http.get<HttpResponse<NewRequest>>(`${this.API_URL}/approved-request/store/${id}`, {
      headers: this.httpHeaders
    });
  }


  approveRequestSupAdmin(id: string): Observable<HttpResponse<NewRequest>> {
    return this.http.get<HttpResponse<NewRequest>>(`${this.API_URL}/approved-request/${id}`, {
      headers: this.httpHeaders
    });
  }

  checkStatus(request: string): Observable<HttpResponse<CheckRequestStatus>> {
    return this.http.get<HttpResponse<CheckRequestStatus>>(`${this.API_URL}/check-request-status/search/${request}`, {
      headers: this.httpHeaders
    });
  }


  rejectRequestAdmin(request: URLSearchParams): Observable<HttpResponse<NewRequest>> {
    return this.http.post<HttpResponse<NewRequest>>(`${this.API_URL}/reject-request`, request, {
      headers: this.httpHeader().set("content-Type", "application/x-www-form-urlencoded")
    })
  }

  rejectSupAdminRequest(request: URLSearchParams): Observable<HttpResponse<NewRequest>> {
    return this.http.post<HttpResponse<NewRequest>>(`${this.API_URL}/reject-request/store-sup-admin`, request, {
      headers: this.httpHeader().set("content-Type", "application/x-www-form-urlencoded")
    })
  }

  updateRequestBySupAdmin(request: URLSearchParams): Observable<HttpResponse<NewRequest>> {
    return this.http.post<HttpResponse<NewRequest>>(`${this.API_URL}/update-request`, request, {
      headers: this.httpHeader().set("content-Type", "application/x-www-form-urlencoded")
    })
  }

  updateRequestByAdmin(request: URLSearchParams): Observable<HttpResponse<NewRequest>> {
    return this.http.post<HttpResponse<NewRequest>>(`${this.API_URL}/update-request/store`, request, {
      headers: this.httpHeader().set("content-Type", "application/x-www-form-urlencoded")
    })
  }

  showFileToUpdate(id: string): Observable<HttpResponse<UpdateRequest>> {
    return this.http.get<HttpResponse<UpdateRequest>>(`${this.API_URL}/update-request/show/${id}`, {
      headers: this.httpHeaders
    });
  }

  checkStatusList(id: string): Observable<HttpResponse<CheckRequestStatus[]>> {
    return this.http.get<HttpResponse<CheckRequestStatus[]>>(`${this.API_URL}/check-request-status/list/${id}`, {
      headers: this.httpHeaders
    });
  }

  checkStatusListAdmin(id: string): Observable<HttpResponse<CheckRequestStatus[]>> {
    return this.http.get<HttpResponse<CheckRequestStatus[]>>(`${this.API_URL}/check-request-status/list-all-admin/${id}`, {
      headers: this.httpHeaders
    });
  }

  checkStatusListDpaf(id: string): Observable<HttpResponse<CheckRequestStatus[]>> {
    return this.http.get<HttpResponse<CheckRequestStatus[]>>(`${this.API_URL}/check-request-status/list-all-dpaf/${id}`, {
      headers: this.httpHeaders
    });
  }

  listApprovedRejected(): Observable<HttpResponse<CheckRequestStatus[]>> {
    return this.http.get<HttpResponse<CheckRequestStatus[]>>(`${this.API_URL}/check-request-status/list-approved-rejected`, {
      headers: this.httpHeaders
    });
  }
  nonRadiation(): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(`${this.API_URL}/dnrs/check`, {
      headers: this.httpHeaders
    });
  }
  checkIfUserHasValidApp(): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(`${this.API_URL}/check-validity/app`, {
      headers: this.httpHeaders
    });
  }

  checkIfUserHasValidAppAndDnr(): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(`${this.API_URL}/check-validity/both`, {
      headers: this.httpHeaders
    });
  }
  downloadPdf(requestNumber: string) {
    this.http.get(`${this.API_URL}/file/pdf/${requestNumber}`, { responseType: 'blob' })
      .subscribe(response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        saveAs(blob, 'Attestation_de_Présence_au_Poste.pdf');
      });
  }
  downloadPdf1(requestNumber: string) {
    this.http.get(`${this.API_URL}/file/pdf/${requestNumber}`, { responseType: 'blob' })
      .subscribe(response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        saveAs(blob, 'Attestation_de_Présence_au_Poste.pdf');
      });
  }
  searchDocument(requestNumber: string) {
    // Utiliser HttpParams pour passer la référence en tant que paramètre de requête
    const params = new HttpParams().set('reference', requestNumber);

    this.http.get(`${this.API_URL}/document-records/search?`, { params, responseType: 'blob' }).subscribe(
      (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        window.open(url); // Ouvre le document dans une nouvelle fenêtre
      },
      (error) => {
        this.errorMessage = "Document non trouvé";
      }
    );
  }

  downloadDnrPdf(){
    this.http.get(`${this.API_URL}/file/dnr`, { responseType: 'blob' })
      .subscribe(response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        saveAs(blob, 'Certificat_de_Non_Radiation.pdf');
      });
  }

  downloadValidityPdf(){
    this.http.get(`${this.API_URL}/file/validity`, { responseType: 'blob' })
      .subscribe(response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        saveAs(blob, 'Attestation_de_Validité_des_Services.pdf');
      });
  }

  showRequest(requestNumber: string): Observable<HttpResponse<NewRequest>> {
    return this.http.get<HttpResponse<NewRequest>>(`${this.API_URL}/new-request/show/${requestNumber}`, {
      headers: this.httpHeaders
    });
  }




}

