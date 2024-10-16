import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DashbordHttpService } from '../../backoffice/services/http/dashbord-http.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent {
  reference: string = ''; // La référence saisie par l'utilisateur
  documentUrl: string | null = null; // URL du document à afficher
  errorMessage: string = ''; // Message d'erreur

  constructor(private http: HttpClient,    private dashboardHttpService: DashbordHttpService,) {}


  printDocument() {
    window.print();
  }
  onSubmit( ) {
      if (this.reference) {
        this.dashboardHttpService.searchDocument(this.reference);
  }

   //this.dashboardHttpService.downloadDnrPdf();
 }
 /* downloadDocument() {
    const blob = new Blob([this.document.content], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.document.title}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  }*/

}
