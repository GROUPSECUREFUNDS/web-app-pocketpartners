import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {OcrReceiptService} from "../../services/ocr-receipt.service";
import {OcrReceiptEntity} from "../../model/ocr-receipt-entity";
import {ImageService} from "../../../shared/services/image.service";

@Component({
  selector: 'app-ocr-receipt',
  templateUrl: './ocr-receipt.component.html',
  styleUrl: './ocr-receipt.component.css'
})
export class OcrReceiptComponent {
    ocrData:OcrReceiptEntity | undefined;
    isLoading:boolean=false;

    constructor(
      @Inject(MAT_DIALOG_DATA) public data: { receiptId:number},
      protected imageService:ImageService,
      private ocrReceiptService:OcrReceiptService
    ) {
    }
    ngOnInit() {
      this.isLoading = true;
      if (this.data && this.data.receiptId) {
        this.ocrReceiptService.getOcrReceiptByReceiptId(this.data.receiptId).subscribe({
          next: (data) => {
            this.ocrData = data;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error en OCR:', err);
            this.isLoading = false; // también en caso de error
          }
        });
      } else {
        this.isLoading = false; // por si no hay imagePath
      }
    }


}
