import {Component, inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/weche-space/portail/menu-connexion/models/user';
import {AuthService, UserType} from 'src/app/weche-space/portail/menu-connexion/services/auth.service';
import { TokenStorageService } from 'src/app/weche-space/portail/menu-connexion/services/token-storage.service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user!:User;
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  /**
   * Creates an instance of the class.
   *
   * @param {TokenStorageService} tokenStorageService - The token storage service.
   * @param {Router} router - The router service.
   * @param {AuthService} authService - The authentication service.
   */
  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private authService: AuthService
  ) {}


  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    this.user = this.tokenStorageService.getUserInfoByToken();
  }

  /**
   * Getter for the user data.
   *
   * @returns {UserType} - The current user data.
   */
  get userData(): UserType {
    return this.authService.currentUserValue;
  }


  /**
   * Logs out the user.
   */
  logout(): void {
    localStorage.removeItem(this.authLocalStorageToken);
    this.router.navigate(['/connexion'], {
      queryParams: {},
    });
    window.location.reload();
  }

  /**
   * Redirects the user based on their role.
   */
  redirectTo(): void {
    if (this.userData?.roles[0].roleName === 'ROLE_USER') {
      this.router.navigate(['/backoffice/demande-app']);
    } else {
      this.router.navigate(['/backoffice']);
    }
  }
}

