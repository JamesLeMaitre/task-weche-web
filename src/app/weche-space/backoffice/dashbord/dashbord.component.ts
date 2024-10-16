import {Component, OnDestroy, OnInit} from '@angular/core';
import {first, Subscription} from "rxjs";
import {DashboardService} from "../services/dashboard.service";
import {User} from "../../portail/menu-connexion/models/user";
import {TokenStorageService} from "../../portail/menu-connexion/services/token-storage.service";
import {NewRequest} from "../models/new-request";
import {AuthService, UserType} from "../../portail/menu-connexion/services/auth.service";

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent implements OnInit, OnDestroy {
  demandes: NewRequest[] = [];
  newRequest: NewRequest | undefined;
  user!:User;
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  rejectRequestCount: number = 0;
  newRequestCount: number = 0;
  pendingRequestCount: number = 0;
  approvedRequestCount: number = 0;
  newRequests: NewRequest[] = [];
  p:number =1;
  itemsPerPage: number = 10;
  totalPages: number = 0;

  constructor(
    private service: DashboardService,
    private tokenStorageService: TokenStorageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.user = this.tokenStorageService.getUserInfoByToken();
    this.listeDesDemandes();
    this.getRejectRequestCount();
    this.getNewRequestCount();
    this.getPendingRequestCount();
    this.getApprovedRequestCount();
  }

  get currentUser():UserType {
    return this.authService.currentUserValue;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  private listeDesDemandes() {
    const strucID = this.user.structure.id;
    if(this.currentUser?.roles[0].roleName === "ROLE_SUPER_ADMIN"){
      const sb = this.service.requestListSupAdmin(strucID)
        .pipe(first())
        .subscribe(res => {
        this.demandes = res;
        this.totalPages = Math.ceil(this.demandes.length / this.itemsPerPage);
        this.unsubscribe.push(sb);
      })
    }else {
      const sb = this.service.listDemandes(strucID)
        .pipe(first())
        .subscribe(res => {
        this.demandes = res;
          this.demandes.forEach(element => {
            this.getRequest(element.requestNumber);
          })
        this.totalPages = Math.ceil(this.demandes.length / this.itemsPerPage);
        this.unsubscribe.push(sb);
      })
    }


  }

  private getRejectRequestCount(): void {
    const dataSubscr = this.service.countRejectRequest()
      .pipe(first()).subscribe((data) => {
        if (data) {
          this.rejectRequestCount = data;
        }
      });
    this.unsubscribe.push(dataSubscr);
  }

  private getNewRequestCount(): void {
    const dataSubscr = this.service.countNewRequest()
      .pipe(first()).subscribe((data) => {
        if (data) {
          this.newRequestCount = data;
        }
      });
    this.unsubscribe.push(dataSubscr);
  }

  private getPendingRequestCount(): void {
    const dataSubscr = this.service.countPendingRequest()
      .pipe(first()).subscribe((data) => {
        if (data) {
          this.pendingRequestCount = data;
        }
      });
    this.unsubscribe.push(dataSubscr);
  }

  private getApprovedRequestCount(): void {
    const dataSubscr = this.service.countApprovedRequest()
      .pipe(first()).subscribe((data) => {
        if (data) {
          this.approvedRequestCount = data;
        }
      });
    this.unsubscribe.push(dataSubscr);
  }

  private getNewRequest(id: string): void {
    const dataSubscr = this.service.listNewRequest(id)
      .pipe(first()).subscribe((data) => {
        if (data) {
          this.newRequests = data;
        }
      });
    this.unsubscribe.push(dataSubscr);
  }

  private getRequest(requestNumber: string) {
    const subscription = this.service.showRequest(requestNumber)
      .pipe(first()).subscribe((response) => {
        this.newRequest = response;
      })
    this.unsubscribe.push(subscription);
  }

}
