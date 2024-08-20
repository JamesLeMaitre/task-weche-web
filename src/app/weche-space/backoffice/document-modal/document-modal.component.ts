import { Component, Inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {NewRequest} from "../models/new-request";
@Component({
  selector: 'app-document-modal',
  templateUrl: './document-modal.component.html',
  styleUrls: ['./document-modal.component.css']
})
export class DocumentModalComponent {
;
  details: NewRequest = new NewRequest();

  constructor(

    private modalService: NgbModal,


  ) {
  }
}
