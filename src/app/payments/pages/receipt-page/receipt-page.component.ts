import {Component} from '@angular/core';
import {PaymentCardMode} from "../../model/payment-card-mode";
import {PaymentEntity} from "../../model/payment-entity";
import {PaymentService} from "../../services/payment.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ReceiptEntity} from "../../model/receipt-entity";
import {ReceiptService} from "../../services/receipt.service";
import {ImageService} from "../../../shared/services/image.service";
import {sendPasswordResetEmail} from "@angular/fire/auth";
import {MatDialog} from "@angular/material/dialog";
import {AddReceiptsComponent} from "../../components/add-receipts/add-receipts.component";
import {PaymentDetailsMode} from "../../model/payment-details-mode";
import {AuthenticationService} from "../../../iam/services/authentication.service";

@Component({
  selector: 'app-receipt-page',
  templateUrl: './receipt-page.component.html',
  styleUrl: './receipt-page.component.css'
})
export class ReceiptPageComponent {
  payment: PaymentEntity | undefined;
  receipts: ReceiptEntity[] = [];
  mode: PaymentDetailsMode = PaymentDetailsMode.PRIVATE;

  constructor(
    private paymentService:PaymentService,
    private receiptService:ReceiptService,
    protected imageService:ImageService,
    private activatedRouter:ActivatedRoute,
    private dialog:MatDialog,
  ) {

  }

  ngOnInit(){
    let paymentId = this.activatedRouter.snapshot.paramMap.get('paymentId');
    if (this.activatedRouter.snapshot.queryParamMap.get('mode') === PaymentDetailsMode.PUBLIC) {
      this.mode = PaymentDetailsMode.PUBLIC;
    } else {
      this.mode = PaymentDetailsMode.PRIVATE;
    }
    // this.paymentService.getPaymentById(+paymentId!).subscribe((data) => {
    //   this.payment = data;
    //   this.authService.currentUserId.subscribe((userId) => {
    //     if (this.payment && this.payment.userId !== userId) {
    //       this.router.navigate([`payments/${this.payment.id}/receipts`], {queryParams: {mode: PaymentDetailsMode.PUBLIC}});
    //     }
    //   });
    // });

    if (paymentId) {
      this.fetchData(+paymentId);
    } else {
      this.payment = undefined;
    }
  }
  deleteReceipt(receipt: ReceiptEntity) {
    this.receiptService.deleteReceipt(receipt.id).subscribe(()=>{
        this.fetchData(this.payment?.id!);
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
  fetchData(paymentId:number) {
    if (paymentId) {
      this.paymentService.getPaymentById(paymentId).subscribe((data) => {
        this.payment = data;
        this.receiptService.getReceiptsByPaymentId(this.payment?.id!).subscribe((receiptData) => {
          this.receipts = receiptData.map(receipt => {
            if (receipt.imagePath) {
              receipt.imagePath = this.imageService.getImageUrlById(receipt.imagePath);
            }
            receipt.issueDate = new Date(receipt.issueDate);
            return receipt;
          });
        });
      });
    } else {
      this.payment = undefined;
    }
  }

  protected readonly PaymentCardMode = PaymentCardMode;
  protected readonly sendPasswordResetEmail = sendPasswordResetEmail;
  protected readonly PaymentDetailsMode = PaymentDetailsMode;
}
