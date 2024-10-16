import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { StructureService } from '../../../shared/services/structure.service';
import { Structure } from '../../../shared/models/structure';
import { first, Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlloretraiteService } from './services/alloretraite.service';
import { getResult, phoneNumberValidator } from '../../../shared/ts/main';
import { AuthService } from '../menu-connexion/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../menu-connexion/services/token-storage.service';
import { User } from '../menu-connexion/models/user';

@Component({
  selector: 'app-menu-alloretraite',
  templateUrl: './menu-alloretraite.component.html',
  styleUrls: ['./menu-alloretraite.component.css'],
})
export class MenuAlloretraiteComponent implements OnInit, OnDestroy {
  structure: Structure[] = [];
  alloretariteForm!: FormGroup;
   // Utilisation de @ViewChild pour récupérer le template 'formError'
   @ViewChild('formError', { static: true }) formError!: TemplateRef<any>;
  message: string = '';
  success: string = '';  hasError: boolean | undefined;
  loginForm!: FormGroup;
  isLoading$: Observable<boolean>;
  passwordInputType: string = 'password';
  isPasswordVisible: boolean = false;
  toggleEyes: boolean = false;
  years: number[] = [];
  user!: User;isTrue:boolean |undefined;
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private tokenStorageService: TokenStorageService,
    private structureService: StructureService,

    private service: AlloretraiteService
  ) {

    this.isLoading$ = this.authService.isLoading$;
    if (this.authService.currentUserValue) {
      this.isTrue=true;
      console.log("la value",this.isTrue)
      }else{
        this.isTrue=false;   console.log("la value",this.isTrue)
      }
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.alloretariteForm.controls;
  }
  ngOnInit() {
    this.listStructure();
    this.makeForm();
    this.listAnnees();
    this.initForm();
    this.user = this.tokenStorageService.getUserInfoByToken();
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  private listStructure() {
    const subscription = this.structureService
      .listStructure()
      .pipe(first())
      .subscribe((response) => {
        this.structure = response;
      });
    this.unsubscribe.push(subscription);
  }
  listAnnees() {
    const currentYear = new Date().getFullYear();
    const startYear = 2010;
    for (let year = currentYear; year >= startYear; year--) {
      this.years.push(year);
    }
  }
  get f1() {
    return this.loginForm.controls;
  }
  makeForm() {
    this.alloretariteForm = this.fb.group({
      firstName:[{value: '', disabled: true}],
      lastName:[{value: '', disabled: true}],
      yearOfDeparture: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
      phoneNumber:[{value: '', disabled: true}],
      email:[{value: '', disabled: true}],
      birthDate:[{value: '', disabled: true}],
      emergencyContact: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
      subject: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
      message: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
      structureId:[{value: '', disabled: true}],
      serialNumber:[{value: '', disabled: true}]
    });
  }
  submit() {
    if (this.alloretariteForm.invalid) {
      // Marquer tous les champs comme touchés pour déclencher l'affichage des messages d'erreur
      this.alloretariteForm.markAllAsTouched();
      return;
    }
    // Récupérer les données du formulaire
    const formdata = getResult(this.f);
    formdata['email'] = this.user.email;
    formdata['firstName'] = this.user.firstname;
    formdata['lastName'] = this.user.lastname;
    formdata['serialNumber'] = this.user.serialNumber;
    formdata['structureId'] = this.user.structure.id;
    formdata['phoneNumber'] = this.user.phoneNumber.toString();
    formdata['birthDate'] = this.user.birthdate.toString();
    console.log('formdata', formdata);
    // Reformater la date de naissance
  /*if (formdata['birthDate']) {
      formdata['birthDate'] = this.formatDate(formdata['birthDate']);
    }*/
     
      if (formdata['birthDate']) {
        const date = new Date(Number(formdata['birthDate']));
        const day = ('0' + date.getDate()).slice(-2); // Ajoute un zéro devant si nécessaire
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Mois commence à 0, donc ajouter 1
        const year = date.getFullYear();
        formdata['birthDate'] = `${day}/${month}/${year}`; // Format 'DD/MM/YYYY'
      }
    const alloretaite = this.service
      .sendRequest(formdata)
      .pipe(first())
      .subscribe((data: any) => {
        if (!data) {
          this.message = "Désolé, veuillez réessayer.";
        } else {
          this.success = "Votre demande a été envoyée avec succès.";
        }

      });
    this.alloretariteForm.reset();
  }
  initForm(): void {
    this.loginForm = this.fb.group({
      username: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(35),
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }
  formatDate(dateString: string): string {
    // Assumer que dateString est au format yyyy-mm-dd
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2); // Ajoute un zéro devant le jour si nécessaire
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Ajoute un zéro devant le mois si nécessaire
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  submit2(): void {
    this.hasError = false;
    const data = getResult(this.f1);
    const loginSubscr = this.authService
      .login(data)
      .pipe(first())
      .subscribe((user: User | undefined) => {
        console.log('user', user);
        if (user) {
          if (user.roles[0].roleName === 'ROLE_USER') {
            this.router.navigate(['/alloretraite']).then(() => {
              window.location.reload();
            });
          } else {
            this.router.navigate(['/alloretraite']);
          }
        } else {
          this.hasError = true;
          console.log('user', this.hasError);
        }
      });
    this.unsubscribe.push(loginSubscr);
  }
}
