import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {first, Observable, Subscription} from "rxjs";
import {AuthService} from "./services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {getResult} from "../../../shared/ts/main";
import {User} from "./models/user";

@Component({
  selector: 'app-menu-connexion',
  templateUrl: './menu-connexion.component.html',
  styleUrls: ['./menu-connexion.component.css']
})
export class MenuConnexionComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup ;
  passwordInputType: string = 'password';
  isPasswordVisible: boolean = false;
  hasError: boolean | undefined;
  returnUrl: string | undefined;
  isLoading$: Observable<boolean>;
  toggleEyes: boolean = false;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private render2: Renderer2,
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(35),]),],
      password: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100),]),],
    });
  }

  submit(): void {
    this.hasError = false;
    const data = getResult(this.f);
    const loginSubscr = this.authService.login(data).pipe(first()).subscribe((user: User | undefined) => {

      console.log("user",user)
        if (user) {
          if (user.roles[0].roleName === "ROLE_USER") {
            this.router.navigate(["/backoffice/suivi"]);
          }else {
            this.router.navigate(["/backoffice"]);
          }
        } else {
          this.hasError = true;
          console.log("user",this.hasError)
        }
      });
    this.unsubscribe.push(loginSubscr);
  }

  ngOnDestroy():void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible; // Toggle password visibility
    this.passwordInputType = this.isPasswordVisible ? 'text' : 'password'; // Toggle input type
  }
}
