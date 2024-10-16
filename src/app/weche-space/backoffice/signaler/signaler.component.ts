import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenStorageService } from '../../portail/menu-connexion/services/token-storage.service';
import { User } from '../../portail/menu-connexion/models/user';

@Component({
  selector: 'app-signaler',
  templateUrl: './signaler.component.html',
  styleUrls: ['./signaler.component.css']
})
export class SignalerComponent {
  complaintForm!: FormGroup;
  user!: User;
  constructor(private fb: FormBuilder, private tokenStorageService: TokenStorageService,) {}

  ngOnInit() {
    this.user = this.tokenStorageService.getUserInfoByToken();

    this.complaintForm = this.fb.group({
      fullName: [{value: '', disabled: true}],
      email: [{value: '', disabled: true}],
      phoneNumber: [{value: '', disabled: true}],
      complaintType: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  submitComplaint() {
    if (this.complaintForm.valid) {
      // Traitement des données du formulaire
      console.log(this.complaintForm.value);
    } else {
      this.complaintForm.markAllAsTouched();
    }
  }
}
