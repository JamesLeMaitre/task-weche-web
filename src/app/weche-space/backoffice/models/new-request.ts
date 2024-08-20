import {User} from "../../portail/menu-connexion/models/user";
import {Structure} from "../../../shared/models/structure";
import {FileAttachment} from "./file-attachment";

export class NewRequest {
  id!:string;
  createdAt!:Date;
  firstName!:string;
  lastName!:string;
  structure!:Structure;
  civilName!:string;
  startPeriod!:Date;
  endPeriod!:Date;
  dateOfFirstEntryService!:Date;
  firstNameOfPreviousOfficial!:string;
  lastNameOfPreviousOfficial!:string;
  serialNumberOfPreviousOfficial!:string;
  gradeOfPreviousOfficial!:string;
  positionHeldOfPreviousOfficial!:string;
  bodyOfPreviousOfficial!:string;
  handingOver!: FileAttachment;
  appointmentDecree!: FileAttachment;
  title!:string;
  requestStatus!:string;
  requestNumber!:string;

}
