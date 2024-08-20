import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute} from "@angular/router";
import {DashboardService} from "../services/dashboard.service";
import {NewRequest} from "../models/new-request";
import {AuthService, UserType} from "../../portail/menu-connexion/services/auth.service";
import {DocumentModalComponent} from '../document-modal/document-modal.component';
import {DocumentModal2Component} from '../document-modal2/document-modal2.component';
import {CheckRequestStatus} from "../models/check-request-status";
import {first, Subscription} from "rxjs";
import {getResult} from "../../../shared/ts/main";
import {Location} from "@angular/common";
import {WebsocketService} from "../../../shared/services/websocket.service";

@Component({
  selector: 'app-detail-nomme',
  templateUrl: './detail-nomme.component.html',
  styleUrls: ['./detail-nomme.component.css']
})
export class DetailNommeComponent implements OnInit, OnDestroy {
  message!: string;
  paramKey: string = '';
  details: NewRequest = new NewRequest();
  @Input() public alerts: Array<string> = [];
  @ViewChild('rejeter') rejeter: TemplateRef<any> | undefined;
  @ViewChild('modifier') modifier: TemplateRef<any> | undefined;
  rejectRequestAdminForm!: FormGroup;
  updateRequestAdminForm!: FormGroup;
  checkStatusData!: CheckRequestStatus;
  protected readonly CheckRequestStatus = CheckRequestStatus;
  private modalRef!: NgbModalRef;
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    private service: DashboardService,
    private authService: AuthService,
    private location2: Location,
    private webSocketService: WebsocketService
  ) {
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
    const modalRef = this.modalService.open(DocumentModalComponent, {centered: true});
    modalRef.componentInstance.details = details;
    {
      details
    }
  }

  openDocument2(details: NewRequest) {
    const modalRef = this.modalService.open(DocumentModal2Component, {centered: true});
    modalRef.componentInstance.details = details;
    {
      details
    }
  }

  getRequestDetail() {
    if (this.user?.roles[0].roleName === "ROLE_SUPER_ADMIN") {
      const dataSubscr = this.service.getRequestDetailBySupAdmin(this.paramKey)
        .pipe(first()).subscribe((data) => {
          if (data) {
            this.getCheckStatus(data.requestNumber)
            this.details = data;
          }
        });
      this.unsubscribe.push(dataSubscr);
    } else if(this.user?.roles[0].roleName === "ROLE_ADMIN") {
      const dataSubscr = this.service.getAdminRequestDetail(this.paramKey)
        .pipe(first()).subscribe((data) => {
          if (data) {
            this.getCheckStatus(data.requestNumber)
            this.details = data;
          }
        });
      this.unsubscribe.push(dataSubscr);
    } else {
      const dataSubscr = this.service.showRejectRequestUser(this.paramKey)
        .pipe(first()).subscribe((data) => {
          if (data) {
            this.getCheckStatus(data.requestNumber)
            this.details = data;
            console.log("les details", this.details)
          }
        });
      this.unsubscribe.push(dataSubscr);
    }
  }

  open() {
    this.modalService.open(this.rejeter, {centered: true});
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  modifierBtn() {
    this.modalService.open(this.modifier, {centered: true});
  }

  approvedRequest(id: string) {
    if (this.user?.roles[0].roleName === "ROLE_ADMIN") {
      const dataSubscr = this.service.approveRequest(id)
        .pipe(first()).subscribe((data) => {
          if (data) {
            window.location.reload();
            this.getCheckStatus(data.requestNumber)
            this.message = 'Request approved successfully';
            // this.sendMessage()
          }
        });
      this.unsubscribe.push(dataSubscr);
    } else {
      const dataSubscr = this.service.approveSupAdminRequest(id)
        .pipe(first()).subscribe((data) => {
          if (data) {
            window.location.reload();
            this.getCheckStatus(data.requestNumber)
          }
        });
      this.unsubscribe.push(dataSubscr);
    }
  }

  save(): void {
    this.rejectRequest();
  }

  saveUpdate(): void {
    this.updateRequest();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  initForm() {
    this.rejectRequestAdminForm = this.fb.group({
      reason: ['', Validators.compose([Validators.required])],
      requestId: [this.paramKey]
    })
  }

  initUpdateForm() {
    this.updateRequestAdminForm = this.fb.group({
      appointmentDecree: [false, Validators.compose([Validators.required])],
      handingOver: [false, Validators.compose([Validators.required])],
      reason: ['', Validators.compose([Validators.required])],
      requestId: [this.paramKey]
    })
  }

  sendMessage() {
    if (this.message) {
      this.message = '';
    }
  }

  private rejectRequest(): void {
    const data = getResult(this.f);
    if (this.user?.roles[0].roleName === "ROLE_SUPER_ADMIN") {
      const accountTypeSubscr = this.service.rejectSupAdminRequest(data)
        .pipe(first()).subscribe((data) => {
          if (data) {
            window.location.reload()
            this.getCheckStatus(data.requestNumber);
            /*            this.close();
                        this.location2.back();*/
          }
        });
      this.unsubscribe.push(accountTypeSubscr);
    } else {
      const accountTypeSubscr = this.service.rejectRequestAdmin(data)
        .pipe(first()).subscribe((data) => {
          if (data) {
            window.location.reload()
            this.getCheckStatus(data.requestNumber);
            /* this.close();
             this.location2.back();*/
          }
        });
      this.unsubscribe.push(accountTypeSubscr);
    }
  }

  private updateRequest(): void {
    const data = getResult(this.f2);
    const accountTypeSubscr = this.service.updateRequestBySupAdmin(data)
      .pipe(first()).subscribe((data) => {
        if (data) {
          this.close()
          window.location.reload()
        }
      });
    this.unsubscribe.push(accountTypeSubscr);
  }

  private getCheckStatus(request: string): void {
    const dataSubscr = this.service.getCheckStatus(request)
      .pipe(first()).subscribe((data) => {
        if (data) {
          console.log("Check status", data)
          this.checkStatusData = data;
        }
      });
    this.unsubscribe.push(dataSubscr);
  }
}
