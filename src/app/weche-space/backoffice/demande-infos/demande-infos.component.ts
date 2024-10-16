import { Component } from '@angular/core';
import { TokenStorageService } from '../../portail/menu-connexion/services/token-storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../../portail/menu-contacter-nous/services/contact.service';
import { AuthService } from '../../portail/menu-connexion/services/auth.service';
import { first, Observable, Subscription } from 'rxjs';
import { getResult } from 'src/app/shared/ts/main';
import { User } from '../../portail/menu-connexion/models/user';

@Component({
  selector: 'app-demande-infos',
  templateUrl: './demande-infos.component.html',
  styleUrls: ['./demande-infos.component.css']
})
export class DemandeInfosComponent {
  informationRequestForm!: FormGroup;
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

}
 ngOnInit(): void {
  this.makeForm();   this.user = this.tokenStorageService.getUserInfoByToken();
}

ngOnDestroy(): void {
  // Unsubscribe from all subscriptions
  this.unsubscribe.forEach((subscription) => subscription.unsubscribe());
  this.user = this.tokenStorageService.getUserInfoByToken();
}

makeForm(): void {
  this.informationRequestForm = this.fb.group({
    fullName: [{value: '', disabled: true}],
    email: [{value: '', disabled: true}],
    subject: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });
}

submitInformationRequest() {
  if (this.informationRequestForm.valid) {
    // Traitement des données du formulaire
    console.log(this.informationRequestForm.value);
  } else {
    this.informationRequestForm.markAllAsTouched();
  }
}
}
