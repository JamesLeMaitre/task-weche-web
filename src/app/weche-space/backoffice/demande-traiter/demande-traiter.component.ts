import {Component, OnDestroy, OnInit} from '@angular/core';
import {DashboardService} from "../services/dashboard.service";
import {first, Subscription} from "rxjs";
import {CheckRequestStatus} from "../models/check-request-status";
import {AuthService, UserType} from "../../portail/menu-connexion/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-demande-traiter',
  templateUrl: './demande-traiter.component.html',
  styleUrls: ['./demande-traiter.component.css']
})
export class DemandeTraiterComponent implements OnInit, OnDestroy {
  checkRequestStatuses: CheckRequestStatus[] = [];
  private unsubscribe: Subscription[] = [];

  constructor(
    private service: DashboardService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  get currentUser(): UserType {
    return this.authService.currentUserValue;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    if (this.currentUser) {
      this.checkStatusList(this.currentUser.structure.id);
    }
  }



  protected redirectTo(requestNumber: string) {
    this.router.navigate([`/backoffice/detail-nomme/${requestNumber}`]);
  }

  private checkStatusList(id: string): void {
    if (this.currentUser?.roles[0].roleName ==='ROLE_ADMIN'){
      const dataSubscr = this.service.checkStatusListAdmin(id)
        .pipe(first()).subscribe((data) => {
          if (data) {
            this.checkRequestStatuses = data;
          }
        });
      this.unsubscribe.push(dataSubscr);
    } else {
      const dataSubscr = this.service.checkStatusListDpaf(id)
        .pipe(first()).subscribe((data) => {
          if (data) {
            this.checkRequestStatuses = data;
          }
        });
      this.unsubscribe.push(dataSubscr);
    }
  }
}
