import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentEntity } from "../../model/payment-entity";
import { PartnerEntity } from "../../../pockets/model/partnerEntity";

@Component({
  selector: 'app-form-payment',
  templateUrl: './form-payment.component.html',
  styleUrls: ['./form-payment.component.css']
})
export class FormPaymentComponent {
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  fourthFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  @Input() user: PartnerEntity = new PartnerEntity();
  @Input() joinedGroups: any;
  @Input() pendingPayments: any;
  @Output() onAddPayment: EventEmitter<PaymentEntity> = new EventEmitter<PaymentEntity>();
  @Output() groupChange: EventEmitter<number> = new EventEmitter<number>();

  private Payment = new PaymentEntity();

  constructor(private _formBuilder: FormBuilder, private router: Router) { }

  onSubmit() {
    this.Payment.id = this.secondFormGroup.value.firstCtrl as unknown as number;

    this.onAddPayment.emit(this.Payment);

    
    this.router.navigate(['/outgoing']);
  }

  onGroupSelectionChange(event: any) {
    this.groupChange.emit(event.value);
  }
}
