import {Component, OnDestroy, OnInit} from '@angular/core';
import {DashboardService} from "../services/dashboard.service";
import {debounceTime, first, Observable, Subject, Subscription, switchMap} from "rxjs";
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
  filteredRequests : CheckRequestStatus[] = [];  results: any[] = [];  resul = "";
  searchTerm: string = '';
  p:number =1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  requests: any[] = [];  searchQuery: string = '';  private searchSubject = new Subject<string>();
  constructor(
    private service: DashboardService,
    private authService: AuthService,
    private router: Router
  ) {this.searchSubject.pipe(
    debounceTime(300),
    switchMap(query => this.service.searchAdmin(query))
  ).subscribe(data => {
    if (Array.isArray(data) && data.length > 0) {
      this.checkRequestStatuses = data;
      this.filteredRequests = this.checkRequestStatuses;
      this.resul = ""; // Réinitialise le message d'absence de données
      this.totalPages = Math.ceil(this.filteredRequests.length / this.itemsPerPage);
      console.log("Recherche", this.checkRequestStatuses);
    } else {
      this.resul = "Aucune donnée trouvée"; // Affiche le message d'absence de données
      console.log("Recherche", this.resul);

      // Optionnel : si tu veux afficher les données par défaut
      if (this.searchQuery === '') {
        if (this.currentUser) {
          this.checkStatusList(this.currentUser.structure.id);this.resul = "";
        }
      } else {
        this.checkRequestStatuses = [];
        this.filteredRequests = [];
      }
    }

  });

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
this.resul=""
    }
  }
  onStatusChange(status: string) {
    if (status === 'ALL') {
      this.filteredRequests = [...this.checkRequestStatuses];

    } else {
      this.filteredRequests = this.checkRequestStatuses.filter(request => request.requestStatus === status);

    }
  }
  onSearch() {
    if (this.searchQuery === '') {
      this.resul=""
      if (this.currentUser) {
        this.checkStatusList(this.currentUser.structure.id);
      }
    } else {
      this.searchSubject.next(this.searchQuery);
    }
  }


 /* onStatusChange(event: Event) {
    const target = event.target as HTMLSelectElement; // Type assertion to HTMLSelectElement
    const status = target.value;

    if (status === 'ALL') {
      this.filteredRequests = [...this.checkRequestStatuses];
    } else {
      this.filteredRequests = this.checkRequestStatuses.filter(request => request.requestStatus === status);
    }
  }*/

  protected redirectTo(requestNumber: string) {
    this.router.navigate([`/backoffice/detail-nomme/${requestNumber}`]);
  }

  private checkStatusList(id: string): void {
    if (this.currentUser?.roles[0].roleName ==='ROLE_ADMIN'){
      const dataSubscr = this.service.checkStatusListAdmin(id)
        .pipe(first()).subscribe((data) => {
          if (data) {
            this.checkRequestStatuses = data;
            this.filteredRequests=this.checkRequestStatuses;
            this.totalPages = Math.ceil(this.filteredRequests.length / this.itemsPerPage);
            console.log("les donnee",this.checkRequestStatuses)
          }
        });
      this.unsubscribe.push(dataSubscr);
    } else {
      const dataSubscr = this.service.checkStatusListDpaf(id)
        .pipe(first()).subscribe((data) => {
          if (data) {
            this.checkRequestStatuses = data;  this.filteredRequests=this.checkRequestStatuses;
            this.totalPages = Math.ceil(this.filteredRequests.length / this.itemsPerPage);
          }
        });
      this.unsubscribe.push(dataSubscr);
    }
  }
}
