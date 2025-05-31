import { Component } from '@angular/core';
import {PaymentEntity} from "../../model/payment-entity";
import {PaymentService} from "../../services/payment.service";
import {AuthenticationService} from "../../../iam/services/authentication.service";
import {PaymentStatus} from "../../model/payment-status";
import {PaymentCardMode} from "../../model/payment-card-mode";

@Component({
  selector: 'app-payments-todo-page',
  templateUrl: './payments-todo-page.component.html',
  styleUrl: './payments-todo-page.component.css'
})
export class PaymentsTodoPageComponent {
  payments:PaymentEntity[] = [];

  constructor(private paymentService:PaymentService,private authService:AuthenticationService) {
    this.fetchPayments();
  }

  fetchPayments() {
    this.authService.currUserInformation.subscribe((value) => {
      this.paymentService.getPaymentByUserIdAndStatus(value.userId, PaymentStatus.PENDING).subscribe((data) => {
        this.payments = [...data];
      });
    });
  }

  protected readonly PaymentCardMode = PaymentCardMode;
}
