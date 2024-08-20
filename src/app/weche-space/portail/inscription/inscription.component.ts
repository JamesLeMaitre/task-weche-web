import { Component } from '@angular/core';
import { RegisterService } from '../../backoffice/services/register.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordMatchValidator } from './password-match.validator';
import { first, Observable, Subscription } from 'rxjs';
import { getResult } from 'src/app/shared/ts/main';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css'],
})
export class InscriptionComponent {
  registerForm!: FormGroup;
  isLoading$: Observable<boolean> | undefined;
  private unsubscribe: Subscription[] = [];
    validationErrors: { [key: string]: string } = {};
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private serviceRegister: RegisterService
  ) {
    this.isLoading$ = this.serviceRegister.isLoading$;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }
  ngOnInit() {
    this.makeForm();
  }
  makeForm(): void {
    this.registerForm = this.fb.group(
      {
        firstname: ['', Validators.required],
        phoneNumber:['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Ajout de Validators.pattern pour les numéros
        lastname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        birthdate: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        serialNumber: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validator: passwordMatchValidator }
    );
  }

  private handleValidationErrors(errors: any[]): void {
    this.validationErrors = {};
    errors.forEach(err => {
      this.validationErrors[err.field] = err.defaultMessage;
    });
  }
  formatDate(dateString: string): string {
    // Assumer que dateString est au format yyyy-mm-dd
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2); // Ajoute un zéro devant le jour si nécessaire
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Ajoute un zéro devant le mois si nécessaire
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  onSubmit(): void {

this.save();

  }
 private save( ): void {
    const data=getResult(this.f);
    data['birthdate']=this.formatDate(data['birthdate']);
    const dataSubscr = this.serviceRegister.soumettre(data)
      .pipe(first()).subscribe((data) => {
        console.log("info data",data
        );
        if(data.status==='OK'){
          this.router.navigate(["/connexion"]);
        }
        else if (data.validations[0].defaultMessage) {
          this.handleValidationErrors(data.validations);

        }
      });
    this.unsubscribe.push(dataSubscr);
  }

 /* save(): void {
    const data = this.registerForm.value;
    data['birthdate'] = this.formatDate(data['dateNaissance']);
    const dataSubscr = this.serviceRegister.soumettre(data)
      .pipe(first())
      .subscribe({
        next: (response) => {
          console.log("")
          this.router.navigate(["/connexion"]);
        },
        error: (error) => {
          if (error.status === 400 && error.error.validations) {
            this.handleValidationErrors(error.error.validations);
          }
        }
      });  this.unsubscribe.push(dataSubscr);
  }*/

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
