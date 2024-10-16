import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TokenStorageService} from '../../portail/menu-connexion/services/token-storage.service';
import {User} from '../../portail/menu-connexion/models/user';
import {SuiviService} from '../services/suivi.service';

import {CheckRequestStatus} from '../models/check-request-status';
import {AuthService, UserType,} from '../../portail/menu-connexion/services/auth.service';
import {DashboardService} from '../services/dashboard.service';
import {first, Subscription} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UpdateRequest} from '../models/update-request';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';

@Component({
  selector: 'app-suivi',
  templateUrl: './suivi.component.html',
  styleUrls: ['./suivi.component.css'],
})
export class SuiviComponent implements OnInit, OnDestroy {
  user!: User;
  request!: UpdateRequest;
  fileError: string = ''; // Propriété pour stocker le message d'erreur
  fileError2: string = ''; // Propriété pour stocker le message d'erreur pour le deuxième fichier
  infos!: CheckRequestStatus | undefined;
  attestationForm2!: FormGroup;
  cont: string | undefined;
  id: string | undefined;
  fileName: string | undefined;
  fileName2: string | undefined;
  files: { [key: string]: File | null } = {};
  file1: File | null = null;
  file2: File | null = null;
  message = ""
  @ViewChild('content') content: TemplateRef<any> | undefined;
  @ViewChild('rejeter') rejeter: TemplateRef<any> | undefined;
  private unsubscribe: Subscription[] = [];
  private modalRef!: NgbModalRef;

  /**
   * Creates an instance of the class.
   *
   * @param {TokenStorageService} tokenStorageService - The token storage service.
   * @param {AuthService} authService - The authentication service.
   * @param {SuiviService} service - The suivi service.
   * @param {Router} router - The router service.
   * @param {FormBuilder} fb - The form builder service.
   * @param {NgbModal} modalService - The modal service.
   * @param {DashboardService} dashboardService - The dashboard service.
   */
  constructor(
    private tokenStorageService: TokenStorageService,
    private authService: AuthService,
    private service: SuiviService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private dashboardService: DashboardService
  ) {
  }

  /**
   * Getter for the user data.
   *
   * @returns {UserType} - The current user data.
   */

  get currentUser(): UserType {
    return this.authService.currentUserValue;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribe.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnInit(): void {
    //Retrieve  the user
    this.user = this.tokenStorageService.getUserInfoByToken();
if (this.user.requestNumber==null) {
  this.router.navigate(['/backoffice/demande-app']);
}
    this.infosDemande(this.user.requestNumber);

    this.showFileToUpdate(this.currentUser?.requestNumber!!);
    // alert("this.currentUser?.requestNumber!!")
  }

  infosDemande(requestNumber: string) {
    this.service.infoSuivi(this.currentUser?.requestNumber!!).subscribe((data: any) => {
      // console.log("valeur de la demande", data);
      this.infos = data;
      // console.log("les infos de la demande", this.infos)
    });
  }

  showFileToUpdate(requestNumber: string): void {
    const dataSubscr = this.dashboardService
      .showFileToUpdate(requestNumber)
      .pipe(first())
      .subscribe((data) => {
        if (data) {
          console.log('data', data);
          this.request = data;
          this.makeForm();
        }
      });
    this.unsubscribe.push(dataSubscr);
  }

  suivreMaDemande() {
    this.router.navigate(['/backoffice/suivi']);
    window.location.reload()
  }
demandes(){
  this.router.navigate(['/backoffice/demande-app']);
}
  makeForm(): void {
    if (this.request.appointmentDecree && this.request.handingOver) {
      this.attestationForm2 = this.fb.group({
        handingOver: [null],
        appointmentDecree: [null],
      });
    } else if (this.request.appointmentDecree) {
      this.attestationForm2 = this.fb.group({
        appointmentDecree: [null],
      });
    } else if (this.request.handingOver) {
      this.attestationForm2 = this.fb.group({
        handingOver: [null],
      });
    }
  }


  onFileChange(event: any) {
    const input = event.target;
    const file = input.files[0];

    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2 Mo
        this.fileError = 'La taille du fichier ne doit pas dépasser 2 Mo.';
        this.fileName = '';
        this.attestationForm2.get('handingOver')?.setValue(null); // Réinitialise la valeur du formulaire
      } else {
        this.fileError = '';
        this.fileName = file.name;
        this.file1 = file; // Stockez directement le fichier
        this.attestationForm2.get('handingOver')?.setValue(file);
      }
    } else {
      this.fileName = undefined;
      this.attestationForm2.get('handingOver')?.setValue(null); // Réinitialise la valeur du formulaire
    }
  }

  onFileChange2(event: any) {
    const input2 = event.target;
    const file = input2.files[0];

    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2 Mo
        this.fileError2 = 'La taille du fichier ne doit pas dépasser 2 Mo.';
        this.fileName2 = '';
        this.attestationForm2.get('appointmentDecree')?.setValue(null); // Réinitialise la valeur du formulaire
      } else {
        this.fileError2 = '';
        this.fileName2 = file.name;
        this.file2 = file; // Stockez directement le fichier
        this.attestationForm2.get('appointmentDecree')?.setValue(file);
      }
    } else {
      this.fileName2 = undefined;
      this.attestationForm2.get('appointmentDecree')?.setValue(null); // Réinitialise la valeur du formulaire
    }
  }

  redirectToPage() {
    this.router.navigate(['/backoffice/demande-app']);
    window.location.reload()
  }

  open() {
    this.modalRef = this.modalService.open(this.content, {centered: true});
    this.modalRef.result.then((result) => {
      this.redirectToPage();
    }, (reason) => {
      this.redirectToPage();
    });
  }

  submitFiless() {
    this.id = this.request.request.id;
    // console.log('ddddddddddddddddd', this.attestationForm2.value);
    const formdata = this.attestationForm2.value;
    if (this.file1) {
      formdata['handingOver'] = this.file1;
    }
    if (this.file2) {
      formdata['appointmentDecree'] = this.file2;
    }
    const attestation = this.service
      .update(this.id, formdata)
      .pipe(first())
      .subscribe((data: any) => {
        this.open();
        // console.log('soumission update', data);
      });
    /* this.attestationForm2.reset();*/
    /* this.http.post('/your-upload-endpoint', formData).subscribe(response => {
      console.log('Fichiers soumis avec succès', response);
    }, error => { pending-request/update-file/id
      console.error('Erreur lors de la soumission des fichiers', error);
    });*/
  }

  convertFormDataToObject(formData: FormData): { [key: string]: Blob | string } {
    const obj: { [key: string]: Blob | string } = {};
    formData.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }

  submitFiles() {
    // console.log('submitFiles', this.request)
    this.id = this.request?.newRequest?.id;
    const formdata = this.attestationForm2.value; // Assurez-vous d'utiliser `FormData` ici

    // Ajouter les fichiers au FormData
    if (this.file2) {
      formdata['handingOver'] = this.file2;
    }
    if (this.file1) {
      formdata['appointmentDecree'] = this.file1;
    }

    console.log('les donnees:', formdata, this.id)
    // Appel au service approprié
    if (this.file1 && this.file2) {
      this.service.update(this.id, formdata)
        .pipe(first())
        .subscribe((data: any) => {

          if (data === "undefined") {
            this.erreur()
            this.message = "Désolé, les modifications n'ont pas été prises en compte. Veuillez réessayer."
          } else {
            this.open();
          }

        });
    } else if (this.file1) {
      this.service.update2(this.id, formdata)
        .pipe(first())
        .subscribe((data: any) => {
          if (data === "undefined") {
            this.erreur();


            this.message = "Désolé, les modifications n'ont pas été prises en compte. Veuillez réessayer."
          } else {
            this.open();
          }


        });
    } else if (this.file2) {
      this.service.update1(this.id, formdata)
        .pipe(first())
        .subscribe((data: any) => {
          if (data === "undefined") {
            this.erreur();
            this.message = "Désolé, les modifications n'ont pas été prises en compte. Veuillez réessayer."
          } else {
            this.open();
          }
          console.log('ff', data)
        });
    } else {
      this.erreur();
      this.message = "Aucun fichier n’a été sélectionné"
      console.log('Aucun fichier n’a été sélectionné');
    }
  }


  erreur() {
    this.modalService.open(this.rejeter, {centered: true});
  }


}
