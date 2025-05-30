import { Component } from '@angular/core';
import {PaymentCardMode} from "../../model/payment-card-mode";
import {PaymentEntity} from "../../model/payment-entity";
import {PaymentService} from "../../services/payment.service";
import {ActivatedRoute, Router, RouterLinkActive} from "@angular/router";
import {ReceiptEntity} from "../../model/receipt-entity";
import {ReceiptService} from "../../services/receipt.service";
import {ImageService} from "../../../shared/services/image.service";
import {sendPasswordResetEmail} from "@angular/fire/auth";
import {MatDialog} from "@angular/material/dialog";
import {AddReceiptsComponent} from "../../components/add-receipts/add-receipts.component";
import {OcrReceiptComponent} from "../../components/ocr-receipt/ocr-receipt.component";

@Component({
  selector: 'app-receipt-page',
  templateUrl: './receipt-page.component.html',
  styleUrl: './receipt-page.component.css'
})
export class ReceiptPageComponent {
  payment: PaymentEntity | undefined;
  receipts: ReceiptEntity[] = [];

  constructor(
    private paymentService:PaymentService,
    private receiptService:ReceiptService,
    protected imageService:ImageService,
    private router:ActivatedRoute,
    private dialog:MatDialog,
    private ocrDialog: MatDialog
  ) {

  }

  ngOnInit(){
    let paymentId = this.router.snapshot.paramMap.get('paymentId');
    if (paymentId) {
      this.paymentService.getPaymentById(paymentId).subscribe((data) => {
        this.payment = data;
        this.receiptService.getReceiptsByPaymentId(this.payment?.id!).subscribe((receiptData) => {
          this.receipts = receiptData;
        });
      });
    } else {
      this.payment = undefined;
    }
  }
  showOcrReceiptDialog(receiptImage:string){
    this.ocrDialog.open(OcrReceiptComponent,{data: {imagePath: receiptImage}}).afterClosed().subscribe(() => {
      if (this.payment) {
        this.receiptService.getReceiptsByPaymentId(this.payment.id).subscribe((receiptData) => {
          this.receipts = receiptData;
        });
      }
    });
  }

  showAddReceiptDialog(){
    this.dialog.open(AddReceiptsComponent, {
      data: {
        payment: this.payment
      }
    }).afterClosed().subscribe(() => {
      if (this.payment) {
        this.receiptService.getReceiptsByPaymentId(this.payment.id).subscribe((receiptData) => {
          this.receipts = receiptData;
        });
      }
    });
  }



  protected readonly PaymentCardMode = PaymentCardMode;
  protected readonly sendPasswordResetEmail = sendPasswordResetEmail;
}
