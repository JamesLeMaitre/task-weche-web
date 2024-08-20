import { Component } from '@angular/core';
import { User } from '../../portail/menu-connexion/models/user';
import { TokenStorageService } from '../../portail/menu-connexion/services/token-storage.service';
import { AttestationService } from '../services/attestation.service';
import { DashbordHttpService } from '../services/http/dashbord-http.service';
import { DashboardService } from '../services/dashboard.service';
import { CheckRequestStatus } from '../models/check-request-status';
import { first, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent {

  checkRequestStatuses: CheckRequestStatus[] = [];
  user!: User;
  public unsubscribe: Subscription[] = [];
  constructor(
    private router: Router,

    private service: AttestationService,
    private tokenStorageService: TokenStorageService,
    private dashboardHttpService: DashbordHttpService,
    private dashboardService: DashboardService
) {
}

ngOnInit() {


  this.user = this.tokenStorageService.getUserInfoByToken();
  this.listApprovedRequest()
  /* if (this.user.hasRequested) {
     this.router.navigate(['/backoffice/demande-app']);
   }*/
} protected redirectTo(requestNumber: string) {
  this.router.navigate([`/backoffice/detail-nomme/${requestNumber}`]);
}
private listApprovedRequest() {
  if(this.user.roles[0].roleName === "ROLE_USER"){
    const subscription = this.dashboardService.listApprovedRejectedRequest()
      .pipe(first()).subscribe((response) => {
        // console.log("Response", response);
        this.checkRequestStatuses = response;
      })
    this.unsubscribe.push(subscription);
  }

}

downloadPdf(request: string) {
  this.dashboardHttpService.downloadPdf(request);
}
}
