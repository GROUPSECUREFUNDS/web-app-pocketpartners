import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { SignInRequest } from "../model/sign-in.request";
import { SignInResponse } from "../model/sign-in.response";
import { environment } from "../../../environments/environment";
import { SignUpRequest } from "../model/sign-up.request";
import { SignUpResponse } from "../model/sign-up.response";
import { SignInInfo } from "../model/sign-in-info";
import { PartnerEntity } from '../../pockets/model/partnerEntity';

/**
 * Service for authentication.
 * @summary
 * This service provides methods for signing up, signing in, and signing out.
 * It also provides observables for the signed in status, the signed-in user ID, and the signed-in username.
 */
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  basePath: string = `${environment.baseURL}`;
  httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };

  private signedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private signedInUserId: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private signedInUsername: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private currentUserInformation: BehaviorSubject<SignInInfo> = new BehaviorSubject<SignInInfo>(new SignInInfo('', '', '', '', ''));
  constructor(private router: Router, private http: HttpClient) { }

  get isSignedIn() { return this.signedIn.asObservable(); }

  get currentUserId() { return this.signedInUserId.asObservable(); }

  get currentUsername() { return this.signedInUsername.asObservable(); }

  get currUserInformation() { return this.currentUserInformation.asObservable(); }
  /**
   * Sign up a new user.
   * @param signUpRequest The sign up request.
   * @returns The sign up response.
   */
  signUp(signUpRequest: SignUpRequest, signInInfo: SignInInfo) {
    return this.http.post<SignUpResponse>(`${this.basePath}/authentication/sign-up`, signUpRequest, this.httpOptions)
      .subscribe({
        next: (response) => {
          
          const infoToSave = new SignInInfo(signInInfo.firstName, signInInfo.lastName, signInInfo.phoneNumber, signInInfo.photo, signInInfo.email, response.id);
          this.currentUserInformation = new BehaviorSubject<SignInInfo>(infoToSave);
          this.router.navigate(['/sign-in']).then();
        },
        error: (error) => {
          console.error(`Error while signing up: ${error}`);
          this.router.navigate(['/sign-up']).then();
        }
      });
  }

  saveUserInfo(signInInfo: SignInInfo) {
    return this.http.post<SignInInfo>(`${this.basePath}/usersInformation`, signInInfo, this.httpOptions);
  }

  /**
   * Sign in a user.
   * @param signInRequest The sign in request.
   * @returns The sign in response.
   */
  signIn(signInRequest: SignInRequest) {
    return this.http.post<SignInResponse>(`${this.basePath}/authentication/sign-in`, signInRequest, this.httpOptions)
      .subscribe({
        next: (response) => {
          this.signedIn.next(true);
          this.signedInUserId.next(response.id);
          this.signedInUsername.next(response.username);
          localStorage.removeItem('token');
          localStorage.setItem('token', response.token);
          console.log(`Signed in as ${response.username} with token ${response.token}`);

          if (this.currentUserInformation.value.userId == response.id) {
            this.saveUserInfo(this.currentUserInformation.value).subscribe({
              next: (response: any) => {
                this.router.navigate(['/home']).then();
              },
              error: (error) => {
                console.error(`Error while saving user information: ${error}`);
              }
            });
          } else {
            
            this.signedInUserId.subscribe((userId: any) => {
              this.http.get<PartnerEntity>(`${this.basePath}/usersInformation/userId/${response.id}`, this.httpOptions)
                .subscribe({
                  next: (response: any) => {
                    this.currentUserInformation = new BehaviorSubject<SignInInfo>(response);
                  },
                  error: (error) => {
                    console.error(`Error while obtaining user information: ${error}`);
                  }
                });
              this.router.navigate(['/home']).then();
            });
          }
        },

        error: (error) => {
          this.signedIn.next(false);
          this.signedInUserId.next(0);
          this.signedInUsername.next('');
          console.error(`Error while signing in: ${error}`);
          this.router.navigate(['/sign-in']).then();
        }
      });
  }

  /**
   * Sign out a user.
   *
   * This method signs out a user by clearing the token from local storage and navigating to the sign-in page.
   */
  signOut() {
    this.signedIn.next(false);
    this.signedInUserId.next(0);
    this.signedInUsername.next('');
    localStorage.removeItem('token');
    this.router.navigate(['/sign-in']).then();
  }
}
