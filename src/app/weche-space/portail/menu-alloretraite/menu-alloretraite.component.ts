import {Component, OnDestroy, OnInit} from '@angular/core';
import {StructureService} from "../../../shared/services/structure.service";
import {Structure} from "../../../shared/models/structure";
import {first, Observable, Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlloretraiteService} from "./services/alloretraite.service";
import {getResult} from "../../../shared/ts/main";

@Component({
  selector: 'app-menu-alloretraite',
  templateUrl: './menu-alloretraite.component.html',
  styleUrls: ['./menu-alloretraite.component.css']
})
export class MenuAlloretraiteComponent implements OnInit, OnDestroy {
  structure:Structure[] = [];
  alloretariteForm!:FormGroup;
  years: number[] = [];
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(
    private structureService: StructureService,
    private fb: FormBuilder,
    private service: AlloretraiteService
  ) {}
  // convenience getter for easy access to form fields
  get f() {
    return this.alloretariteForm.controls;
  }
  ngOnInit() {
    this.listStructure();
    this.makeForm();
    this.listAnnees();
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  private listStructure() {
    const subscription = this.structureService.listStructure().pipe(first()).subscribe((response) => {
      this.structure = response;
    })
    this.unsubscribe.push(subscription);
  }
  listAnnees() {
    const currentYear = new Date().getFullYear();
    const startYear = 2010;
    for (let year = currentYear; year >= startYear; year--) {
      this.years.push(year);
    }
  }
  makeForm() {
    this.alloretariteForm = this.fb.group({
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100),]),],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100),]),],
      yearOfDeparture: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100),]),],
      phoneNumber: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20),]),],
      email: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100),]),],
      birthDate: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100),]),],
      emergencyContact: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100),]),],
      subject: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100),]),],
      message: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100),]),],
      structureId: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100),]),],
      serialNumber: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100),]),],
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
  submit() {
    // Récupérer les données du formulaire
    const formdata = getResult(this.f);
    console.log("formdata", formdata);
    // Reformater la date de naissance
    if (formdata['birthDate']) {
      formdata['birthDate'] = this.formatDate(formdata['birthDate']);
    }
    const alloretaite = this.service.sendRequest(formdata).pipe(first()).subscribe((data: any) => {

    });
    this.alloretariteForm.reset();
  }

}
