import { Injectable } from '@angular/core';
import {BaseService} from "../../shared/services/base.service";
import {ReceiptEntity} from "../model/receipt-entity";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReceiptService extends  BaseService<ReceiptEntity>{

  constructor(http:HttpClient) {
    super(http);
    this.resourceEndpoint = '/receipts';
  }
  getReceiptById(receiptId: any) {
    return this.http.get<any>(`${this.resourcePath()}/${receiptId}`, this.httpOptions);
  }
  getReceiptsByPaymentId(paymentId:number):Observable<ReceiptEntity[]> {
    return this.http.get<any>(`${this.resourcePath()}/payment/${paymentId}`, this.httpOptions);
  }

  createReceipt(requestReceipt: any) {
    return this.http.post<any>(`${this.resourcePath()}`, requestReceipt, this.httpOptions).pipe(
      catchError(error => {
        console.error('Error al crear recibo:', error);
        return throwError(() => error); // o un error custom si quieres
      })
    );
  }
}
