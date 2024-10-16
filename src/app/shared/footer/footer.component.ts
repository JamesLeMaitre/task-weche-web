import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  redirectToExternalUrl(url: string): void {
    // Ajout d'un schéma par défaut si l'URL ne le contient pas
    if (!/^https?:\/\//.test(url)) {
      url = 'https://' + url;
    }
    window.open(url, '_blank');
  }
}
