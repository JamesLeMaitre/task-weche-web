import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DashboardService } from '../services/dashboard.service';
import { DashbordHttpService } from '../services/http/dashbord-http.service';
import { Router } from '@angular/router';
import { first, Subscription } from 'rxjs';

@Component({
  selector: 'app-attestation-av',
  templateUrl: './attestation-av.component.html',
  styleUrls: ['./attestation-av.component.css']
})
export class AttestationAvComponent {
  results: boolean = false; // Utilisez camelCase pour les variables
  private unsubscribe: Subscription[] = []; // `private` est souvent préférable pour éviter un accès non voulu
  @ViewChild('content') content: TemplateRef<any> | undefined;
  @ViewChild('rejeter') rejeter: TemplateRef<any> | undefined;
  @ViewChild('modifier') modifier: TemplateRef<any> | undefined;
    message = "";
  private modalRef!: NgbModalRef;
  constructor(
    private router: Router,private dashboardHttpService:DashbordHttpService,
    private dashboardService: DashboardService,    private modalService: NgbModal,
  ) {}

  // Implémentez l'interface OnDestroy
  ngOnDestroy(): void {
    this.unsubscribe.forEach((sub) => sub.unsubscribe());
  }
  open() {
    this.modalRef = this.modalService.open(this.content, {centered: true});

  }

  erreur() {
    this.modalRef=    this.modalService.open(this.rejeter, {centered: true});
  }
  listApprovedRequest(): void {
    const subscription = this.dashboardService.nonRadiation()
      .pipe(first())
      .subscribe((response) => {
        // Vous pouvez traiter la réponse ici
        this.results=response;
        if (this.results==true) {
          this.open()
        }else{
          this.erreur();
          this.message="Désolé ! Vous n'avez pas d'attestation de présence au poste en cours de validité."
        }
        console.log("Response", response);
      });

    this.unsubscribe.push(subscription);
  }
  downloadPdf() {
    //this.dashboardHttpService.downloadPdf(request);
   this.dashboardHttpService.downloadValidityPdf();
 }protected redirectTo() {
  this.router.navigate([`/backoffice/demande-app`]);
  this.modalRef.close();
}checkIfUserHasValidAppAndDnr(): void {
  const subscription = this.dashboardService.checkIfUserHasValidAppAndDnr()
    .pipe(first())
    .subscribe((response) => {
      // Vous pouvez traiter la réponse ici
      this.results = response;
      if (this.results) {
        this.open()
      } else {
        this.erreur();
        this.message = "Désolé ! Vous n'avez pas d'attestation de présence au poste en cours de validité."
      }
      console.log("Response", response);
    });

  this.unsubscribe.push(subscription);
}
}
