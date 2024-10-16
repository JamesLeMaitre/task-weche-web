import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {first, Observable, Subscription} from "rxjs";
import {getResult, phoneNumberValidator} from "../../../shared/ts/main";
import {ContactService} from "./services/contact.service";
import { AuthService } from '../menu-connexion/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../menu-connexion/models/user';
import { TokenStorageService } from '../menu-connexion/services/token-storage.service';

@Component({
  selector: 'app-menu-contacter-nous',
  templateUrl: './menu-contacter-nous.component.html',
  styleUrls: ['./menu-contacter-nous.component.css']
})
export class MenuContacterNousComponent implements OnInit, OnDestroy {
  contactForm!: FormGroup;
  private unsubscribe: Subscription[] = [];
  hasError: boolean | undefined;
  message:string="";
  success:string="";
  loginForm!: FormGroup ;
  isLoading$: Observable<boolean>;  passwordInputType: string = 'password';
  isPasswordVisible: boolean = false; toggleEyes: boolean = false;
  user!: User;
isTrue:boolean |undefined;
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,   private tokenStorageService: TokenStorageService,
    private contactService: ContactService
  ) { this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
    this.isTrue=true;
    console.log("la value",this.isTrue)
    }else{
      this.isTrue=false;   console.log("la value",this.isTrue)
    }
  }
  get f1() {
    return this.loginForm.controls;
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.contactForm.controls;
  }

  ngOnInit(): void {
    this.makeForm(); this.initForm();  this.user = this.tokenStorageService.getUserInfoByToken();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribe.forEach((subscription) => subscription.unsubscribe());
    this.user = this.tokenStorageService.getUserInfoByToken();
  }
  initForm(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(35),]),],
      password: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100),]),],
    });
  }
  makeForm(): void {
    this.contactForm = this.fb.group({
      name: [{value: '', disabled: true}] ,
      email: [{value: '', disabled: true}],
        phoneNumber: [{value: '', disabled: true}],
      serialNumber: [{value: '', disabled: true}],
      subject: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100),]),],
      message: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100),]),]

    });
  }

  submit(): void {
    if (this.contactForm.invalid) {
      // Marquer tous les champs comme touchés pour déclencher l'affichage des messages d'erreur
      this.contactForm.markAllAsTouched();
      return;
    }
    const formdata = getResult(this.f);
    formdata['name'] = this.user.firstname +''+ this.user.lastname;
    formdata['email'] = this.user.email;
   formdata['serialNumber'] = this.user.serialNumber;
    formdata['phoneNumber'] = this.user.phoneNumber.toString();
    const contactSubscr = this.contactService.sendMessage(formdata)
      .pipe(first())
      .subscribe((data: any) => {
        if (!data) {
          this.message = "Désolé, veuillez réessayer.";
        } else {
          this.success = "Votre demande a été envoyée avec succès.";
        }

    });
    this.unsubscribe.push(contactSubscr);
    this.contactForm.reset();
  }
  submit2(): void {
    this.hasError = false;
    const data = getResult(this.f1);
    const loginSubscr = this.authService.login(data).pipe(first()).subscribe((user: User | undefined) => {

      console.log("user",user)
        if (user) {
          if (user.roles[0].roleName === "ROLE_USER") {
            this.router.navigate(["/contacter"]).then(() => {
              window.location.reload();
            });
          }else {
            this.router.navigate(["/contacter"]);
          }
        } else {
          this.hasError = true;
          console.log("user",this.hasError)
        }
      });
    this.unsubscribe.push(loginSubscr);
  }
}
