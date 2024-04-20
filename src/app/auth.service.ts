import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { LocalStorage } from 'ngx-webstorage';
import { interval } from 'rxjs';

import * as md5 from 'md5';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @LocalStorage() private lastUsername: string;
  @LocalStorage() private lastPassword: string;
  @LocalStorage() private token: string;

  private uid: string;

  public get hasLastUsername(): boolean {
    return !!this.lastUsername;
  }

  public get currentFirebaseUId() {
    return this.uid;
  }

  public get currentEmailHash() {
    return md5(this.lastUsername ?? '');
  }

  public get idToken() {
    return this.token;
  }

  public get user() {
    return this.auth.user;
  }

  constructor(private router: Router, private auth: AngularFireAuth, private api: ApiService) {}

  public async init() {
    const user = await this.auth.currentUser;
    if(!user && this.lastUsername && this.lastPassword) {
      await this.signIn(this.lastUsername, this.lastPassword);
    }

    interval(1000 * 60 * 30).subscribe(() => {
      this.getToken();
    });
  }

  async signUp(email: string, password: string, username: string) {
    try {
      await this.auth.createUserWithEmailAndPassword(email, password);
      await this.changeDisplayName(username);
      await this.getToken();
      this.api.createUser().subscribe();
    } catch(e) {
      throw e;
    }
  }

  async signIn(email: string, password: string) {
    try {
      await this.auth.signInWithEmailAndPassword(email, password);
      await this.getToken();
      this.api.createUser().subscribe();

      this.lastUsername = email;
      this.lastPassword = password;
    } catch(e) {
      throw e;
    }
  }

  async signOut() {
    try {
      await this.auth.signOut();
      this.router.navigate(['/login']);
      this.token = '';
      this.lastUsername = '';
      this.lastPassword = '';
    } catch(e) {
      throw e;
    }
  }

  async getToken() {
    const user = await this.auth.currentUser;
    if(!user) {
      return;
    }

    this.uid = user.uid;
    this.token = await user.getIdToken(true) ?? '';
  }

  async changeDisplayName(username: string) {
    const user = await this.auth.currentUser;
    await user.updateProfile({
      displayName: username
    });

    await this.getToken();

    this.api.updateUserDisplayName().subscribe();
  }

  async changePassword(password: string) {
    const user = await this.auth.currentUser;
    await user.updatePassword(password);
  }
}
