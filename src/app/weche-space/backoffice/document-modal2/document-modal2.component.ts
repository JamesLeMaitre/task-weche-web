import { Component } from '@angular/core';
import { NewRequest } from '../models/new-request';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-document-modal2',
  templateUrl: './document-modal2.component.html',
  styleUrls: ['./document-modal2.component.css']
})
export class DocumentModal2Component {
  details: NewRequest = new NewRequest();

  constructor(

    private modalService: NgbModal,


  ) {
  }
}
