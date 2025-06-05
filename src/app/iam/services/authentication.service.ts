import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from "rxjs";
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
  public loginError: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  basePath: string = `${environment.baseURL}`;
  httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };
  private authErrorSubject = new BehaviorSubject<string | null>(null);
  authError$: Observable<string | null> = this.authErrorSubject.asObservable();
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

  signUp(signUpRequest: SignUpRequest, signInInfo: SignInInfo): void {
    this.http.post<SignUpResponse>(`${this.basePath}/authentication/sign-up`, signUpRequest, this.httpOptions)
      .subscribe({
        next: (response) => {
          let signInRequest = new SignInRequest(signUpRequest.username, signUpRequest.password);
          this.http.post<SignInResponse>(`${this.basePath}/authentication/sign-in`, signInRequest, this.httpOptions)
            .subscribe({
              next: (res) => {
                localStorage.setItem('token', res.token)
                signInInfo.userId = response.id;
                this.saveUserInfo(signInInfo).subscribe({
                  next: () => this.router.navigate(['/home']),
                  error: (err) => {
                    console.error('Error al guardar la info del usuario después del registro:', err);
                    this.router.navigate(['/home']);
                  }
                });
              },
              error: (err) => {
                console.error('Error al iniciar sesión', err)
              }
            })

        },
        error: (error) => {
          if (error.status === 409) {
            this.authErrorSubject.next('El correo ya está registrado.');
          } else {
            this.authErrorSubject.next('Error inesperado durante el registro.');
          }
          console.error('Sign-up error:', error);
        }
      });
  }


  saveUserInfo(signInInfo: SignInInfo) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    console.log('[saveUserInfo] Token:', token);

    return this.http.post<SignInInfo>(`${this.basePath}/usersInformation`, signInInfo, { headers });
  }



  /**
   * Sign in a user.
   * @param signInRequest The sign in request.
   * @returns The sign in response.
   */
  signIn(signInRequest: SignInRequest): void {
    this.http.post<SignInResponse>(`${this.basePath}/authentication/sign-in`, signInRequest, this.httpOptions)
      .subscribe({
        next: (response) => {
          this.signedIn.next(true);
          this.signedInUserId.next(response.id);
          this.signedInUsername.next(response.username);
          localStorage.removeItem('token');
          localStorage.setItem('token', response.token);
          console.log(`Signed in as ${response.username} with token ${response.token}`);
          this.loginError.next(null); // 🔄 limpiar errores

          const currentId = this.currentUserInformation.value.userId;

          if (currentId === response.id) {
            this.saveUserInfo(this.currentUserInformation.value).subscribe({
              next: () => this.router.navigate(['/home']),
              error: (error) => {
                console.error(`Error while saving user information: ${error}`);
                this.router.navigate(['/home']); // Navegar igual para no bloquear
              }
            });
          } else {
            // Obtener info del backend, luego navegar
            this.http.get<PartnerEntity>(`${this.basePath}/usersInformation/userId/${response.id}`, this.httpOptions)
              .subscribe({
                next: (userInfo: any) => {
                  this.currentUserInformation.next(userInfo); // 🔄 CORRECTO: no reemplaza el subject
                  this.router.navigate(['/home']);
                },
                error: (error) => {
                  console.error(`Error while obtaining user information: ${error}`);
                  this.router.navigate(['/home']); // Redirige igual para no dejar al usuario colgado
                }
              });
          }
        },
        error: (error) => {
          this.signedIn.next(false);
          this.signedInUserId.next(0);
          this.signedInUsername.next('');

          if (error.status === 401) {
            this.loginError.next('La contraseña ingresada no es correcta.');
          } else if (error.status === 404) {
            this.loginError.next('El usuario no existe.');
          } else {
            this.loginError.next('Ocurrió un error inesperado. Intenta nuevamente.');
          }

          this.router.navigate(['/sign-in']);
        }
      });
  }



  restoreSession(){
    this.signIn(new SignInRequest("josehp","josehp"));
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
