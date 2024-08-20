import { Injectable } from '@angular/core';
import {User} from "../models/user";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  user!:User;

  constructor(
    private authService: AuthService,
  ) { }
  getUserInfoByToken(): User {
    if (this.authService.currentUserValue) {
      this.user = this.authService.currentUserValue;
    }
    return this.user;
  }
}
