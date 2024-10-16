import {Role} from "./role";
import {File} from "./file";
import {Structure} from "../../../../shared/models/structure";


export class User {
  id!: string;
  username!: string;
  birthdate!:number;
  firstname!: string;
  lastname!: string;
  phoneNumber!: number;
  email!: string;
  file!: File
  roles!: Role[];
  structure!: Structure;
  profession!: string;
  requestNumber!:string;
  hasRequested!:boolean;
  serialNumber!:string;
  body!:string;
  grade!:string;
  ppsDate!:Date;
  gradeDate!:Date;
  oldUserFirstname!:string;
  oldUserLastname!:string;
  oldUserSerialNumber!:string;
  ua!:string;
  dateRetreat!:Date
}
