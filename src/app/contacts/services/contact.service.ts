import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BaseService } from "../../shared/services/base.service";
import { ContactEntity } from "../model/contact.entity";
import { catchError, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContactService extends BaseService<ContactEntity> {

  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/usersInformation';
  }

  getUserById(userId: any) {
    return this.http.get<any>(`${this.resourcePath()}/userId/${userId}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  saveUser(userData: any): Observable<any> {
    return this.http.post<any>(this.resourcePath(), JSON.stringify(userData), this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateUserById(userId: any, updatedUserData: any) {
    return this.http.put<any>(`${this.resourcePath()}/${userId}`, updatedUserData, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

}
