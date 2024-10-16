import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {AttestationService} from "../services/attestation.service";
import {first, Observable, Subscription} from "rxjs";
import {User} from "../../portail/menu-connexion/models/user";
import {TokenStorageService} from "../../portail/menu-connexion/services/token-storage.service";
import {Router} from '@angular/router';
import {DashboardService} from "../services/dashboard.service";
import {CheckRequestStatus} from "../models/check-request-status";
import {DashbordHttpService} from "../services/http/dashbord-http.service";
import {Beneficiary} from "../models/beneficiary";
import {BeneficiaryService} from "../services/beneficiary.service";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale'; // Importer la locale française
@Component({
  selector: 'app-attestation-app',
  templateUrl: './attestation-app.component.html',
  styleUrls: ['./attestation-app.component.css']
})
export class AttestationAppComponent implements OnInit, OnDestroy {
  title1 = 'ng-bootstrap-demo';
  step = 1;  today!: string  ;
  cont: string | undefined;
  fileName: string | undefined;
  fileName2: string | undefined;
  files: { [key: string]: File | null } = {};
  // file1: { [key: string]: File | null } = {};
  // file2: { [key: string]: File | null } = {};
  file1: File | null = null;
  file2: File | null = null;
  beneficiaries: Beneficiary[] = [];
  attestationForm!: FormGroup;
  title = 'Etape 1 sur 3 : Informations sur l’agent';
  message = "";
  user!: User;
  fileError: string = ''; // Propriété pour stocker le message d'erreur
  fileError2: string = ''; // Propriété pour stocker le message d'erreur pour le deuxième fichier
  @ViewChild('content') content: TemplateRef<any> | undefined;
  @ViewChild('rejeter') rejeter: TemplateRef<any> | undefined;
  checkRequestStatuses: CheckRequestStatus[] = [];
  public unsubscribe: Subscription[] = [];
  beneficiarySelected: string | undefined;
  isLoading$: Observable<boolean>;
  private modalRef!: NgbModalRef;


  /**
   * @param {NgbModal} modalService - The modal service.
   * @param {Router} router - The router service.
   * @param {FormBuilder} fb - The form builder service.
   * @param {NgbModal} modalService - The modal service.
   * @param {AttestationService} service - The attestation service.
   * @param {TokenStorageService} tokenStorageService - The token storage service.
   * @param {DashbordHttpService} dashboardHttpService - The dashboard http service.
   * @param {DashboardService} dashboardService - The dashboard service.
   * @param {BeneficiaryService} beneficiaryService - The beneficiary service.
   */
  constructor(private router: Router,
              private fb: FormBuilder,
              private modalService: NgbModal,
              private service: AttestationService,
              private tokenStorageService: TokenStorageService,
              private dashboardHttpService: DashbordHttpService,
              private dashboardService: DashboardService,
              private beneficiaryService: BeneficiaryService
  ) {
    this.isLoading$ = this.service.isLoading$;
  }

  get f() {
    return this.attestationForm.controls;
  }

  ngOnInit() {

    this.makeForm();
    this.user = this.tokenStorageService.getUserInfoByToken();

    if (this.user && this.user.gradeDate) {
      this.user.gradeDate = new Date(this.user.gradeDate); // Assurez-vous que c'est un objet Date
      const formattedDate = this.formatDate(this.user.gradeDate);
      this.attestationForm.get('step1.gradeDate')?.setValue(formattedDate); // Mettre la valeur du formulaire
    }
    if (this.user && this.user.ppsDate) {
      this.user.ppsDate = new Date(this.user.ppsDate); // Assurez-vous que c'est un objet Date
      const formattedDate = this.formatDate(this.user.ppsDate);
      this.attestationForm.get('step1.ppsDate')?.setValue(formattedDate); // Mettre la valeur du formulaire
    }
    if (this.user && this.user.dateRetreat) {
      this.user.dateRetreat = new Date(this.user.dateRetreat); // Assurez-vous que c'est un objet Date
      const formattedDate = this.formatDate(this.user.dateRetreat);
      this.attestationForm.get('step1.dateRetreat')?.setValue(formattedDate); // Mettre la valeur du formulaire
    }
    this.listApprovedRequest()
    this.getBeneficiaries()
    if (this.user.hasRequested) {
      this.router.navigate(['/backoffice/suivi']);
    }

    this.onAgentTypeChange()
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((s) => s.unsubscribe());
  }
  formatDate(date: Date): string {
    return format(date, 'dd/MM/yyyy', { locale: fr }); // Format 'DD/MM/YYYY' en français
  }
  /* makeForm(): void {

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

       }, { validators: this.dateValidation }),
       step2: this.fb.group({
         firstNameOfPreviousOfficial: ['', Validators.required],
         lastNameOfPreviousOfficial: ['', Validators.required],
         serialNumberOfPreviousOfficial: [{value: '', disabled: true}],
         gradeOfPreviousOfficial: ['', Validators.required],
         bodyOfPreviousOfficial: ['', Validators.required],
         positionHeldOfPreviousOfficial: ['', Validators.required],

       })
     });
   }*/
  makeForm(): void {

    this.attestationForm = this.fb.group({
      step1: this.fb.group({
        beneficiaryId: ['', Validators.required],
        lastName: [{value: '', disabled: true}],
        firstName: [{value: '', disabled: true}],
        structureId: [{value: '', disabled: true}],
        dateRetreat:[{value: '', disabled: true}],
        serialNumber: [{value: '', disabled: true}],
        body: [{value: '', disabled: true}],
        grade: [{value: '', disabled: true}],
        gradeDate:  [{value: '', disabled: true}],

        ua: [{value: '', disabled: true}],
        // Ajoute les champs spécifiques aux agents sans fonction ou nommés

        ppsDate:  [{value: '', disabled: true}],
      }),
      step2: this.fb.group({
        firstNameOfPreviousOfficial:  [{value: '', disabled: true}],
        lastNameOfPreviousOfficial: [{value: '', disabled: true}],
        positionHeldOfPreviousOfficial: [''],

        handingOver: [''],
        appointmentDecree: [''],
        serialNumberOfPreviousOfficial: [{value: '', disabled: true}],
        positionHeld: [''],


        uaDate: [''],
        fonction: [''],
        dateFonction: [''],
      })
    }); const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1); // Soustraire un mois

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Mois commence à 0
    const day = String(currentDate.getDate()).padStart(2, '0');

    this.today = `${year}-${month}-${day}`;

  }

  onAgentTypeChange() {
    this.attestationForm.get('step1.beneficiaryId')?.valueChanges.subscribe((beneficiaryId) => {
      const fonctionControl = this.attestationForm.get('step2.fonction');
      const firstNameOfPreviousOfficialControl = this.attestationForm.get('step2.firstNameOfPreviousOfficial');
      const lastNameOfPreviousOfficialControl = this.attestationForm.get('step2.lastNameOfPreviousOfficial');
      const dateFonctionControl = this.attestationForm.get('step2.dateFonction');
      const appointmentDecreeControl = this.attestationForm.get('step2.appointmentDecree');
      const handingOverControl = this.attestationForm.get('step2.handingOver');
      const serialNumberOfPreviousOfficialControl = this.attestationForm.get('step2.serialNumberOfPreviousOfficial');



      const positionHeldOfPreviousOfficialControl = this.attestationForm.get('step2.positionHeldOfPreviousOfficial');

      const uaDateControl = this.attestationForm.get('step2.uaDate');
      if (beneficiaryId === 'nomme') {
        fonctionControl?.setValidators([Validators.required]);  // Ajouter le validateur required
        firstNameOfPreviousOfficialControl?.setValidators([Validators.required]);
        lastNameOfPreviousOfficialControl?.setValidators([Validators.required]);
        dateFonctionControl?.setValidators([Validators.required]);
        appointmentDecreeControl?.setValidators([Validators.required]);
        handingOverControl?.setValidators([Validators.required]);
        serialNumberOfPreviousOfficialControl?.setValidators([Validators.required]);


      } else {
        fonctionControl?.clearValidators();  // Retirer le validateur required
        firstNameOfPreviousOfficialControl?.clearValidators();  // Retirer le validateur required
        lastNameOfPreviousOfficialControl?.clearValidators();  // Retirer le validateur required
        dateFonctionControl?.clearValidators();  // Retirer le validateur required
        appointmentDecreeControl?.clearValidators();  // Retirer le validateur required
        handingOverControl?.clearValidators();  // Retirer le validateur required
        serialNumberOfPreviousOfficialControl?.clearValidators();  // Retirer le validateur required


      }
      if (beneficiaryId === 'sans-fonction' || beneficiaryId === 'sans-fonction-departemental') {


        positionHeldOfPreviousOfficialControl?.setValidators([Validators.required]);
        uaDateControl?.setValidators([Validators.required]);
      } else {

        positionHeldOfPreviousOfficialControl?.clearValidators();  // Retirer le validateur required
        uaDateControl?.clearValidators();  // Retirer le validateur required

      }
      fonctionControl?.updateValueAndValidity();  // Recalcule la validité du champ
      firstNameOfPreviousOfficialControl?.updateValueAndValidity();
      lastNameOfPreviousOfficialControl?.updateValueAndValidity();
      dateFonctionControl?.updateValueAndValidity();
      appointmentDecreeControl?.updateValueAndValidity();  // Recalcule la validité du champ
      handingOverControl?.updateValueAndValidity();
      serialNumberOfPreviousOfficialControl?.updateValueAndValidity();

      positionHeldOfPreviousOfficialControl?.updateValueAndValidity();
      uaDateControl?.updateValueAndValidity();

    });
  }

  dateValidation(group: AbstractControl): { [key: string]: any } | null {
    const start = group.get('startPeriod')?.value;
    const end = group.get('endPeriod')?.value;
    const firstEntry = group.get('dateOfFirstEntryService')?.value;

    if (start && end && firstEntry) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const firstEntryDate = new Date(firstEntry);

      if (startDate >= endDate) {
        return {invalidPeriod: 'La période de début doit être inférieure à la période de fin.'};
      }

      if (firstEntryDate > startDate || firstEntryDate >= endDate) {
        return {invalidFirstEntry: 'La date de prise de service doit être antérieure ou égale à la date de début.'};
      }
    }

    return null;
  }

  erreur() {
    this.modalRef = this.modalService.open(this.rejeter, {centered: true});
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

  /*nextStep() {
    if (this.attestationForm.get('step1')?.valid) {
      this.step = 2;
      this.title = 'Etape 2 sur 2 : Informations sur le responsable remplacé ';
    }
  }*/
    nextStep() {
      if (this.step === 1) {
        // Marque tous les champs de l'étape 1 comme touchés
        this.attestationForm.get('step1')?.markAllAsTouched();

        // Vérifie si l'étape 1 est valide
        if (this.attestationForm.get('step1')?.valid) {
          this.step = 2; // Passer à l'étape 2
          this.title = 'Etape 2 sur 3 : Informations complémentaires ';
        }
      } else if (this.step === 2) {
        // Marque tous les champs de l'étape 2 comme touchés
        this.attestationForm.get('step2')?.markAllAsTouched();

        // Vérifie si l'étape 2 est valide
        if (this.attestationForm.get('step2')?.valid) {
          this.step = 3; // Passer à l'étape 3 (récapitulatif)
          this.title = 'Etape 3 sur 3 : le récapitulatif ';
        }
      }
    }

  previousStep() {
    if (this.step === 3) {
      this.step = 2; // Retour à l'étape 2
      this.title = 'Etape 2 sur 3 : Informations complémentaires ';
    } else if (this.step === 2) {
      this.step = 1; // Retour à l'étape 1
      this.title = 'Etape 1 sur 3 : Informations sur l’agent';
    }
  }

  delayedRedirect() {
    setTimeout(() => {
      this.redirectToPage();
    }, 5000); // 5000 millisecondes = 5 secondes
  }

  formaterDate(dateString: string): string {
    // Assumer que dateString est au format yyyy-mm-dd
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2); // Ajoute un zéro devant le jour si nécessaire
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Ajoute un zéro devant le mois si nécessaire
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  onSelectBeneficiary(beneficiary: Beneficiary) {
    this.attestationForm.get('step1')?.get('beneficiaryId')?.setValue(beneficiary.id);
    this.beneficiaries.forEach(b => {
      // if (b.id === beneficiary.id) {
      this.beneficiarySelected = b.attribute;
      this.attestationForm.get('step1')?.get('beneficiaryId')?.setValue(b.attribute);
      // }
    });
  }

  submit() {
    // Récupérer les données du formulaire
    if (this.attestationForm.get('step2')?.valid) {
      const formdata = {
        ...this.attestationForm.get('step1')!.value,
        ...this.attestationForm.get('step2')!.value
      };

      // Ajouter l'id de la structure
      formdata['structureId'] = this.user.structure.id;
    formdata['serialNumber'] = this.user.serialNumber;
      formdata['lastName'] = this.user.lastname;
      formdata['beneficiaryId'] = this.attestationForm.get('step1')?.get('beneficiaryId')?.value;

      // console.log("beneficiaryId", this.beneficiarySelected);
      formdata['firstName'] = this.user.firstname;
      formdata['body'] = this.user.body;
      formdata['grade'] = this.user.firstname;
      formdata['gradeDate'] = this.user.firstname;
      formdata['ua'] = this.user.ua;
      formdata['dateRetreat'] = this.user.dateRetreat;
      formdata['ppsDate'] = this.user.ppsDate;
          formdata['lastNameOfPreviousOfficial'] = this.user.oldUserLastname;
          formdata['serialNumberOfPreviousOfficial'] = this.user.oldUserSerialNumber;
          formdata['firstNameOfPreviousOfficial'] = this.user.oldUserFirstname;
      // Ajouter le fichier au formulaire
      formdata['handingOver'] = this.file1;

      formdata['ppsDate'] = this.formaterDate(this.attestationForm.get('step1')?.get('ppsDate')?.value);
      formdata['uaDate'] = this.formaterDate(this.attestationForm.get('step2')?.get('uaDate')?.value);
      formdata['gradeDate'] = this.formaterDate(this.attestationForm.get('step1')?.get('gradeDate')?.value);
      // formdata['dateFonction'] = this.formaterDate(this.attestationForm.get('step2')?.get('dateFonction')?.value);
      if (this.attestationForm.get('step2')?.get('dateFonction')?.value) {
        formdata['dateFonction'] = this.formaterDate(this.attestationForm.get('step2')?.get('dateFonction')?.value);
      } else {
        formdata['dateFonction'] = this.formaterDate("2000-01-01");
      }

      if (this.attestationForm.get('step2')?.get('uaDate')?.value) {
        formdata['uaDate'] = this.formaterDate(this.attestationForm.get('step2')?.get('uaDate')?.value);
      } else {
        formdata['uaDate'] = this.formaterDate("2000-01-01");
      }
      // formdata['gradeDate'] = this.formaterDate(this.attestationForm.get('step2')?.get('gradeDate')?.value);
      // formdata['appointmentDecree'] = this.file2;


      // console.log("form-data", formdata)

      // Add the files only if they exist
      /*if (this.file1) {
        formdata['handingOver'] = this.file1;
      }
      if (this.file2) {
        formdata['appointmentDecree'] = this.file2;
      }*/
      if (this.file1 && this.file2) {
        formdata['handingOver'] = this.file1;
        formdata['appointmentDecree'] = this.file2;

        const attestation = this.service.sendRequest(formdata)
          .pipe(first()).subscribe((data: any) => {
            // console.log("data", data);/
            if (data === undefined) {
              this.erreur()
              this.message = "Désolé, un problème est survenu lors de l'envoi de votre demande. Veuillez réessayer"
            } else {
              this.open();
            }

          });
        this.unsubscribe.push(attestation);
      } else {
        if (formdata['beneficiaryId'] === null) {
        }
        const attestation = this.service.createRequest(formdata)
          .pipe(first()).subscribe((data: any) => {
            // console.log("data", data);
            if (data == undefined) {
              this.erreur()
              this.message = "Désolé, un problème est survenu lors de l'envoi de votre demande. Veuillez réessayer"
            } else {
              this.open();
            }

          });
        this.unsubscribe.push(attestation);
      }
      // Envoyer la requête

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
/*  onFileChange(event: any) {
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
        this.attestationForm.get('step2')?.get('handingOver')?.setValue(file);
      }
    } else {
      this.fileName = undefined;
      this.attestationForm.get('step2')?.get('handingOver')?.setValue(null); // Réinitialise la valeur du formulaire
    }
  }*/

    onFileChange(event: any) {
      const input = event.target;
      const file = input.files[0];

      if (file) {
        const fileType = file.type; // Get the MIME type of the file

        if (fileType !== 'application/pdf') {
          this.fileError = 'Seuls les fichiers PDF sont autorisés.';
          this.fileName = '';
          this.attestationForm.get('step1')?.get('handingOver')?.setValue(null); // Reset form value
        } else if (file.size > 2 * 1024 * 1024) { // 2 MB
          this.fileError = 'La taille du fichier ne doit pas dépasser 2 Mo.';
          this.fileName = '';
          this.attestationForm.get('step1')?.get('handingOver')?.setValue(null); // Reset form value
        } else {
          this.fileError = '';
          this.fileName = file.name;
          this.file1 = input.files[0];
          this.attestationForm.get('step2')?.get('handingOver')?.setValue(file);
        }
      } else {
        this.fileName = undefined;
        this.attestationForm.get('step2')?.get('handingOver')?.setValue(null); // Reset form value
      }
    }

    onFileChange2(event: any) {
      const input2 = event.target;
      const file = input2.files[0];

      if (file) {
        const fileType = file.type; // Get the MIME type of the file

        if (fileType !== 'application/pdf') {
          this.fileError2 = 'Seuls les fichiers PDF sont autorisés.';
          this.fileName2 = '';
          this.attestationForm.get('step2')?.get('appointmentDecree')?.setValue(null); // Reset form value
        } else if (file.size > 2 * 1024 * 1024) { // 2 MB
          this.fileError2 = 'La taille du fichier ne doit pas dépasser 2 Mo.';
          this.fileName2 = '';
          this.attestationForm.get('step2')?.get('appointmentDecree')?.setValue(null); // Reset form value
        } else {
          this.fileError2 = '';
          this.file2 = input2.files[0];
          this.fileName2 = file.name;
          this.attestationForm.get('step2')?.get('appointmentDecree')?.setValue(file);
        }
      } else {
        this.fileName2 = undefined;
        this.attestationForm.get('step2')?.get('appointmentDecree')?.setValue(null); // Reset form value
      }
    }

  downloadPdf(request: string) {
    this.dashboardHttpService.downloadPdf(request);
    //this.dashboardHttpService.downloadDnrPdf();
  }

  protected redirectTo(requestNumber: string) {
    this.router.navigate([`/backoffice/detail-nomme/${requestNumber}`]);
  }

  private getBeneficiaries() {
    const subscription = this.beneficiaryService.listBeneficiaries()
      .pipe(first()).subscribe((data) => {
        this.beneficiaries = data;
      })
    this.unsubscribe.push(subscription);


  }

  private listApprovedRequest() {
    if (this.user.roles[0].roleName === "ROLE_USER") {
      const subscription = this.dashboardService.listApprovedRejectedRequest()
        .pipe(first()).subscribe((response) => {
          // console.log("Response", response);
          this.checkRequestStatuses = response;
        })
      this.unsubscribe.push(subscription);
    }

  }


}
