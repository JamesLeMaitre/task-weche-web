import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {first, Subscription} from "rxjs";
import {getResult, phoneNumberValidator} from "../../../shared/ts/main";
import {ContactService} from "./services/contact.service";

@Component({
  selector: 'app-menu-contacter-nous',
  templateUrl: './menu-contacter-nous.component.html',
  styleUrls: ['./menu-contacter-nous.component.css']
})
export class MenuContacterNousComponent implements OnInit, OnDestroy {
  contactForm!: FormGroup;
  private unsubscribe: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) {
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.contactForm.controls;
  }

  ngOnInit(): void {
    this.makeForm();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribe.forEach((subscription) => subscription.unsubscribe());
  }

  makeForm(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100),]),],
      email: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100),]),],
      subject: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100),]),],
      message: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100),]),],
      phoneNumber: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        phoneNumberValidator()
      ])],
      serialNumber: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100),]),],
    });
  }

  submit(): void {
    const formdata = getResult(this.f);
    const contactSubscr = this.contactService.sendMessage(formdata)
      .pipe(first())
      .subscribe((data: any) => {

    });
    this.unsubscribe.push(contactSubscr);
    this.contactForm.reset();
  }
}
