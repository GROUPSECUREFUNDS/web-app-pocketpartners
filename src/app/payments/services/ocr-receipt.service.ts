import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {OcrReceiptEntity} from "../model/ocr-receipt-entity";

@Injectable({
  providedIn: 'root'
})
export class OcrReceiptService {
  basePath:string = "http://localhost:8000/ocr-process";
  constructor(private httpClient:HttpClient) { }

  sendRequestForOcr(imageUrl:string):Observable<OcrReceiptEntity>{
    return this.httpClient.post<any>(`${this.basePath}`, {imageUrl}).pipe(
      catchError(error => {
        console.error('Error during OCR request:', error);
        throw error; // Rethrow the error for further handling
      })
    );
  }
}
