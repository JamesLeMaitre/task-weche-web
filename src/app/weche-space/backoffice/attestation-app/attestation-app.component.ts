import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {AttestationService} from "../services/attestation.service";
import {first, Observable, Subscription} from "rxjs";
import {User} from "../../portail/menu-connexion/models/user";
import {TokenStorageService} from "../../portail/menu-connexion/services/token-storage.service";
import {Router} from '@angular/router';
import {DashboardService} from "../services/dashboard.service";
import {CheckRequestStatus} from "../models/check-request-status";
import {DashbordHttpService} from "../services/http/dashbord-http.service";

@Component({
  selector: 'app-attestation-app',
  templateUrl: './attestation-app.component.html',
  styleUrls: ['./attestation-app.component.css']
})
export class AttestationAppComponent implements OnInit, OnDestroy {
  title1 = 'ng-bootstrap-demo';
  step = 1;
  cont: string | undefined;
  fileName: string | undefined;
  fileName2: string | undefined;
  files: { [key: string]: File | null } = {};
  file1: { [key: string]: File | null } = {};
  file2: { [key: string]: File | null } = {};
  attestationForm!: FormGroup;
  title = 'Etape 1 sur 2 : Informations sur l’agent';
  user!: User;
  fileError: string = ''; // Propriété pour stocker le message d'erreur
  fileError2: string = ''; // Propriété pour stocker le message d'erreur pour le deuxième fichier
  @ViewChild('content') content: TemplateRef<any> | undefined;
  checkRequestStatuses: CheckRequestStatus[] = [];
  public unsubscribe: Subscription[] = [];
  private modalRef!: NgbModalRef;

  constructor(private router: Router,
              private fb: FormBuilder,
              private modalService: NgbModal,
              private service: AttestationService,
              private tokenStorageService: TokenStorageService,
              private dashboardHttpService: DashbordHttpService,
              private dashboardService: DashboardService
  ) {
  }

  get f() {
    return this.attestationForm.controls;
  }

  ngOnInit() {

    this.makeForm();
    this.user = this.tokenStorageService.getUserInfoByToken();
    this.listApprovedRequest()
  if (this.user.hasRequested) {
       this.router.navigate(['/backoffice/suivi']);
     }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((s) => s.unsubscribe());
  }

  makeForm(): void {
    this.attestationForm = this.fb.group({
      step1: this.fb.group({
        lastName: [{value: '', disabled: true}],
        firstName: [{value: '', disabled: true}],
        structureId: [{value: '', disabled: true}],
        civilName: ['', Validators.required],
        startPeriod: ['', Validators.required],
        endPeriod: ['', Validators.required],
        dateOfFirstEntryService: ['', Validators.required],
        handingOver: ['', Validators.required],
        appointmentDecree: ['', Validators.required],

      }),
      step2: this.fb.group({
        firstNameOfPreviousOfficial: ['', Validators.required],
        lastNameOfPreviousOfficial: ['', Validators.required],
        serialNumberOfPreviousOfficial: [{value: '', disabled: true}],
        gradeOfPreviousOfficial: ['', Validators.required],
        bodyOfPreviousOfficial: ['', Validators.required],
        positionHeldOfPreviousOfficial: ['', Validators.required],

      })
    });
  }

  open() {
    this.modalRef = this.modalService.open(this.content, {centered: true});
    this.modalRef.result.then((result) => {
      this.redirectToPage();
    }, (reason) => {
      this.redirectToPage();
    });
  }

  redirectToPage() {
    this.router.navigate(['/backoffice/suivi']);
    window.location.reload()
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  suivreMaDemande() {
    this.router.navigate(['/backoffice/suivi']);
    window.location.reload()
  }

  nextStep() {
    if (this.attestationForm.get('step1')?.valid) {
      this.step = 2;
      this.title = 'Etape 2 sur 2 : Informations sur le responsable remplacé ';
    }
  }

  delayedRedirect() {
    setTimeout(() => {
      this.redirectToPage();
    }, 5000); // 5000 millisecondes = 5 secondes
  }

  formatDate(dateString: string): string {
    // Assumer que dateString est au format yyyy-mm-dd
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2); // Ajoute un zéro devant le jour si nécessaire
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Ajoute un zéro devant le mois si nécessaire
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  submit() {
    // Récupérer les données du formulaire
    if (this.attestationForm.get('step2')?.valid) {
      const formdata = {
        ...this.attestationForm.get('step1')!.value,
        ...this.attestationForm.get('step2')!.value
      };
      // Reformater les dates
      if (formdata['startPeriod']) {
        formdata['startPeriod'] = this.formatDate(formdata['startPeriod']);
      }
      if (formdata['endPeriod']) {
        formdata['endPeriod'] = this.formatDate(formdata['endPeriod']);
      }
      if (formdata['dateOfFirstEntryService']) {
        formdata['dateOfFirstEntryService'] = this.formatDate(formdata['dateOfFirstEntryService']);
      }

      // Ajouter l'id de la structure
      formdata['structureId'] = this.user.structure.id;


      formdata['lastName'] = this.user.lastname;

      formdata['firstName'] = this.user.firstname;
      formdata['serialNumberOfPreviousOfficial'] = this.user.serialNumber;
      // Ajouter le fichier au formulaire
      formdata['handingOver'] = this.file1;
      formdata['appointmentDecree'] = this.file2;

      // Envoyer la requête
      const attestation = this.service.sendRequest(formdata).pipe(first()).subscribe((data: any) => {
        this.open();


      });
      this.attestationForm.reset();
    }

  }

  /*onFileChange(event: any) {
    const input = event.target;
    if (input.files.length > 0) {
      this.fileName = input.files[0].name;
      this.file1 = input.files[0];
      this.attestationForm.get('step1')?.get('handingOver')?.setValue(this.file1);
    } else {
      this.fileName = undefined;
    }
  }

  onFileChange2(event: any) {
    const input2 = event.target;
    if (input2.files.length > 0) {
      this.fileName2 = input2.files[0].name;
      this.file2 = input2.files[0];
      this.attestationForm.get('step1')?.get('appointmentDecree')?.setValue(this.file2);
    } else {
      this.fileName2 = undefined;
    }
  }*/
  onFileChange(event: any) {
    const input = event.target;
    const file = input.files[0];

    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2 Mo
        this.fileError = 'La taille du fichier ne doit pas dépasser 2 Mo.';
        this.fileName = '';
        this.attestationForm.get('step1')?.get('handingOver')?.setValue(null); // Réinitialise la valeur du formulaire
      } else {
        this.fileError = '';
        this.fileName = file.name;
        this.file1 = input.files[0];
        this.attestationForm.get('step1')?.get('handingOver')?.setValue(file);
      }
    } else {
      this.fileName = undefined;
      this.attestationForm.get('step1')?.get('handingOver')?.setValue(null); // Réinitialise la valeur du formulaire
    }
  }

  onFileChange2(event: any) {
    const input2 = event.target;
    const file = input2.files[0];

    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2 Mo
        this.fileError2 = 'La taille du fichier ne doit pas dépasser 2 Mo.';
        this.fileName2 = '';
        this.attestationForm.get('step1')?.get('appointmentDecree')?.setValue(null); // Réinitialise la valeur du formulaire
      } else {
        this.fileError2 = '';
        this.file2 = input2.files[0];
        this.fileName2 = file.name;
        this.attestationForm.get('step1')?.get('appointmentDecree')?.setValue(file);
      }
    } else {
      this.fileName2 = undefined;
      this.attestationForm.get('step1')?.get('appointmentDecree')?.setValue(null); // Réinitialise la valeur du formulaire
    }
  }

 protected redirectTo(requestNumber: string) {
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
