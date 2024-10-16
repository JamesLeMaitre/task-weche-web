import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { NewRequest } from '../models/new-request';
import {
  AuthService,
  UserType,
} from '../../portail/menu-connexion/services/auth.service';
import { DocumentModalComponent } from '../document-modal/document-modal.component';
import { DocumentModal2Component } from '../document-modal2/document-modal2.component';
import { CheckRequestStatus } from '../models/check-request-status';
import {first, Observable, Subscription} from 'rxjs';
import { getResult } from '../../../shared/ts/main';
import { Location } from '@angular/common';
import { WebsocketService } from '../../../shared/services/websocket.service';
declare var bootstrap: any;
@Component({
  selector: 'app-detail-nomme',
  templateUrl: './detail-nomme.component.html',
  styleUrls: ['./detail-nomme.component.css'],
})
export class DetailNommeComponent implements OnInit, OnDestroy {
  message!: string;
  paramKey: string = '';selectedRequestId: string | null = null;

  details: NewRequest = new NewRequest();
  @Input() public alerts: Array<string> = [];
  @ViewChild('rejeter') rejeter: TemplateRef<any> | undefined;
  @ViewChild('err') err: TemplateRef<any> | undefined;
  @ViewChild('modifier') modifier: TemplateRef<any> | undefined;
  rejectRequestAdminForm!: FormGroup;
  updateRequestAdminForm!: FormGroup;
  checkStatusData!: CheckRequestStatus | undefined;
  protected readonly CheckRequestStatus = CheckRequestStatus;
  private modalRef!: NgbModalRef;
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  mess: string = '';
  isLoading$: Observable<boolean>;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    private service: DashboardService,
    private authService: AuthService,
    private location2: Location,
    private webSocketService: WebsocketService
  ) {
    this.isLoading$ = this.authService.isLoading$;
  }

  get f() {
    return this.rejectRequestAdminForm!.controls;
  }

  get f2() {
    return this.updateRequestAdminForm!.controls;
  }

  get user(): UserType {
    return this.authService.currentUserValue;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params) => {
      this.paramKey = params['paramKey'];
      this.getRequestDetail();
    });
    this.initForm();
    this.initUpdateForm();
  }

  openDocument(details: NewRequest) {
    const modalRef = this.modalService.open(DocumentModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.details = details;
    {
      details;
    }
  }
  openConfirmation(id: string) {
    this.selectedRequestId = id;
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    confirmModal.show();
  }

  onConfirm() {
    if (this.selectedRequestId !== null) {
      //this.approvedThirdRequest(String(this.selectedRequestId)); // Convertir l'ID en string
      this.selectedRequestId = null; // Réinitialiser l'identifiant après confirmation
    }
    const confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
    confirmModal.hide(); // Fermer la modale
  }
  openDocument2(details: NewRequest) {
    const modalRef = this.modalService.open(DocumentModal2Component, {
      centered: true,
    });
    modalRef.componentInstance.details = details;
    {
      details;
    }
  }

  getRequestDetail() {
    if (this.user?.roles[0].roleName === 'ROLE_SUPER_ADMIN') {
      const dataSubscr = this.service
        .getRequestDetailBySupAdmin(this.paramKey)
        .pipe(first())
        .subscribe((data) => {
          if (data) {
            // console.log('First data', data);
            this.getCheckStatus(data.requestNumber);
            this.details = data;
          }
        });
      this.unsubscribe.push(dataSubscr);
    } else if (this.user?.roles[0].roleName === 'ROLE_ADMIN') {
      const dataSubscr = this.service
        .getAdminRequestDetail(this.paramKey)
        .pipe(first())
        .subscribe((data) => {
          if (data) {
            console.log('data', data);
            this.getCheckStatus(data.requestNumber);
            this.details = data;

          }
        });
      this.unsubscribe.push(dataSubscr);
    } else {
      const dataSubscr = this.service
        .showRejectRequestUser(this.paramKey)
        .pipe(first())
        .subscribe((data) => {
          if (data) {
            this.getCheckStatus(data.requestNumber);
            this.details = data;
            console.log('les details', this.details);
          }
        });
      this.unsubscribe.push(dataSubscr);
    }
  }

  open() {
    this.modalService.open(this.rejeter, { centered: true });
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  modifierBtn() {
    this.modalService.open(this.modifier, { centered: true });
  }

  approvedThirdRequest(id: string) {
      const dataSubscr = this.service
        .approvedThirdRequest(id)
        .pipe(first())
        .subscribe((data) => {
          if (data) {
            window.location.reload();
            this.getCheckStatus(data.requestNumber);
            this.message = 'Demande approuvée avec succès';
            // this.sendMessage()
          }
        });
      this.unsubscribe.push(dataSubscr);
  }

  approvedRequest(id: string) {
    if (this.user?.roles[0].roleName === 'ROLE_ADMIN') {
      const dataSubscr = this.service
        .approveRequest(id)
        .pipe(first())
        .subscribe((data) => {
          if (data) {
            window.location.reload();
            this.getCheckStatus(data.requestNumber);
            this.message = 'Demande approuvée avec succès';
            // this.sendMessage()
          }
        });
      this.unsubscribe.push(dataSubscr);
    } else {
      const dataSubscr = this.service
        .approveSupAdminRequest(id)
        .pipe(first())
        .subscribe((data) => {
          if (data) {
            window.location.reload();
            this.getCheckStatus(data.requestNumber);
          }
        });
      this.unsubscribe.push(dataSubscr);
    }
  }

  save(): void {
    this.rejectRequest();
  }

  saveUpdate(): void {
    if(this.user?.roles[0].roleName === 'ROLE_ADMIN') {
      this.updateRequestByAdmin();
    } else {
      this.updateRequestBySupAdmin();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  initForm() {
    this.rejectRequestAdminForm = this.fb.group({
      reason: ['', Validators.compose([Validators.required])],
      requestId: [this.paramKey],
    });
  }
  atLeastOneCheckboxChecked(
    group: FormGroup
  ): { [key: string]: boolean } | null {
    const appointmentDecree = group.get('appointmentDecree')?.value;
    const handingOver = group.get('handingOver')?.value;

    // Vérifie si au moins une case est cochée
    if (appointmentDecree || handingOver) {
      return null; // Tout va bien, validation réussie
    }

    // Sinon, retourne une erreur
    return { atLeastOneCheckboxChecked: true };
  }

  initUpdateForm() {
    this.updateRequestAdminForm = this.fb.group(
      {
        appointmentDecree: [false, Validators.required],
        handingOver: [false, Validators.required],
        reason: ['', Validators.required],
        requestId: [this.paramKey],
      },
      {
        validator: this.atLeastOneCheckboxChecked, // Appel à la fonction comme méthode de classe
      }
    );
  }

  sendMessage() {
    if (this.message) {
      this.message = '';
    }
  }

  private rejectRequest(): void {
    const data = getResult(this.f);
    if (this.user?.roles[0].roleName === 'ROLE_SUPER_ADMIN') {
      const accountTypeSubscr = this.service
        .rejectSupAdminRequest(data)
        .pipe(first())
        .subscribe((data) => {
          if (data) {
            window.location.reload();
            this.getCheckStatus(data.requestNumber);
            /*            this.close();
                        this.location2.back();*/
          }
        });
      this.unsubscribe.push(accountTypeSubscr);
    } else {
      console.log('rejectRequestAdmin');
      const accountTypeSubscr = this.service
        .rejectRequestAdmin(data)
        .pipe(first())
        .subscribe((data) => {
          if (data) {
            window.location.reload();
            this.getCheckStatus(data.requestNumber);
            /* this.close();
             this.location2.back();*/
          }
        });
      this.unsubscribe.push(accountTypeSubscr);
    }
  }

  private updateRequestBySupAdmin(): void {
    const data = getResult(this.f2);
    console.log('data', data);
    if (!data['appointmentDecree'] && !data['handingOver']) {
      this.erreur();
      this.mess = "Vous devez sélectionner l'une des options ci-dessous";
    } else {
      const accountTypeSubscr = this.service
        .updateRequestBySupAdmin(data)
        .pipe(first())
        .subscribe((data) => {
          if (data) {
            this.close();
            window.location.reload();
          }
        });
      this.unsubscribe.push(accountTypeSubscr);
    }
    /**/
  }
 // Update request by admin
  private updateRequestByAdmin(): void {
    const data = getResult(this.f2);
    console.log('data', data);
    if (!data['appointmentDecree'] && !data['handingOver']) {
      this.erreur();
      this.mess = "Vous devez sélectionner l'une des options ci-dessous";
    } else {
      const accountTypeSubscr = this.service
        .updateRequestByAdmin(data)
        .pipe(first())
        .subscribe((data) => {
          if (data) {
            this.close();
            window.location.reload();
          }
        });
      this.unsubscribe.push(accountTypeSubscr);
    }
    /**/
  }

  private getCheckStatus(request: string): void {
    const dataSubscr = this.service
      .getCheckStatus(request)
      .pipe(first())
      .subscribe((data) => {
        if (data) {
          // console.log('Check status', data);
          this.checkStatusData = data;
        }
      });
    this.unsubscribe.push(dataSubscr);
  }

  erreur() {
    this.modalService.open(this.err, { centered: true });
  }
}
