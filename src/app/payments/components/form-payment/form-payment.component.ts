import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentEntity } from "../../model/payment-entity";
import { PartnerEntity } from "../../../pockets/model/partnerEntity";
import { PaymentStatus } from "../../model/payment-status";

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
    description: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(0.01)]],
  });

  @Input() user: PartnerEntity = new PartnerEntity();
  @Input() joinedGroups: any;
  @Input() expenses: any[] = [];
  @Output() onAddPayment: EventEmitter<PaymentEntity> = new EventEmitter<PaymentEntity>();
  @Output() groupChange: EventEmitter<number> = new EventEmitter<number>();

  selectedExpense: any = null;

  constructor(private _formBuilder: FormBuilder, private router: Router) { }

  onGroupSelectionChange(event: any) {
    this.groupChange.emit(event.value);
    this.selectedExpense = null;
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
  }

  onExpenseSelectionChange(event: any) {
    this.selectedExpense = this.expenses.find(e => e.id === event.value);
    this.thirdFormGroup.reset();
  }

  get maxAmount(): number {
    return this.selectedExpense ? this.selectedExpense.amount : 0;
  }
  get canSubmit(): boolean {
    return !!this.user.id && !!this.selectedExpense && this.thirdFormGroup.valid;
  }
  onSubmit() {
    if (!this.selectedExpense) return;

    const payment = new PaymentEntity();
    payment.description = this.thirdFormGroup.value.description ?? '';
    payment.amount = +(this.thirdFormGroup.value.amount ?? 0);
    payment.status = PaymentStatus.PENDING;
    payment.userId = this.user.id;
    payment.expenseId = this.selectedExpense.id;

    console.log('userId:', this.user.id, 'expenseId:', this.selectedExpense?.id);
    this.onAddPayment.emit(payment);

    this.router.navigate(['/outgoing']);
  }
}
