import { Component } from '@angular/core';
import {PaymentEntity} from "../../model/payment-entity";
import {PaymentService} from "../../services/payment.service";
import {AuthenticationService} from "../../../iam/services/authentication.service";
import {PaymentStatus} from "../../model/payment-status";
import {PaymentCardMode} from "../../model/payment-card-mode";

@Component({
  selector: 'app-payments-made-page',
  templateUrl: './payments-made-page.component.html',
  styleUrl: './payments-made-page.component.css'
})
export class PaymentsMadePageComponent {

  payments:PaymentEntity[] = [];

  constructor(private paymentService:PaymentService,private authService:AuthenticationService) {
    this.fetchPayments();
  }

  fetchPayments() {
    this.authService.currUserInformation.subscribe((value) => {
      this.paymentService.getPaymentByUserIdAndStatus(value.userId, PaymentStatus.COMPLETED).subscribe((data)=>{
        this.payments = [...data];
      });
    });
  }

  protected readonly PaymentCardMode = PaymentCardMode;
}
