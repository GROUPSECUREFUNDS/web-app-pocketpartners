import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {OcrReceiptEntity} from "../model/ocr-receipt-entity";
import {BaseService} from "../../shared/services/base.service";

@Injectable({
  providedIn: 'root'
})
export class OcrReceiptService extends BaseService<OcrReceiptEntity>{
  constructor(private httpClient:HttpClient) {
    super(httpClient);
    this.resourceEndpoint = '/ocr-receipt';
  }

  getOcrReceiptByImage(imageUrl:string):Observable<OcrReceiptEntity>{
    return this.httpClient.post<OcrReceiptEntity>(`${this.resourcePath()}/from-image`, {"imageId":imageUrl});
  }

  getOcrReceiptByReceiptId(id: number): Observable<OcrReceiptEntity> {
    return this.httpClient.get<OcrReceiptEntity>(`${this.resourcePath()}/from-receipt/${id}`);
  }
}
