import { Injectable } from '@angular/core';
import { BaseService } from "../../shared/services/base.service";
import { PaymentEntity } from "../model/payment-entity";
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PaymentService extends BaseService<PaymentEntity> {

  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/payments';
  }

  getJoinedUserGroups(userId: number): Observable<any> {
    return this.http.get<any>(`${this.basePath}/groups/members/${userId}`, this.httpOptions);
  }

  getPaymentById(paymentId: any) {
    return this.http.get<any>(`${this.resourcePath()}/${paymentId}`, this.httpOptions)
  }

  getPaymentByExpenseId(expenseId: any) {
    return this.http.get<any>(`${this.resourcePath()}/expenseId/${expenseId}`, this.httpOptions)
  }

  getPaymentByUserId(userId: any) {
    return this.http.get<any>(`${this.resourcePath()}/userId/${userId}`, this.httpOptions)
  }

  getPaymentByUserIdAndStatus(userId: any, status: any) {
    return this.http.get<any>(`${this.resourcePath()}/userId/${userId}/status/${status}`, this.httpOptions)
  }

  postCompletePaymentById(paymentId: any) {
    return this.http.post<any>(`${this.resourcePath()}/${paymentId}/completed`, this.httpOptions)
  }

  postPayment(payment: PaymentEntity) {
    return this.http.post<any>(`${this.resourcePath()}`, payment, this.httpOptions)
  }
}
