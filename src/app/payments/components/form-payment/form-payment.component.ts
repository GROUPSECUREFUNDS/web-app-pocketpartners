import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentEntity } from "../../model/payment-entity";
import { PartnerEntity } from "../../../pockets/model/partnerEntity";
import { PaymentStatus } from "../../model/payment-status";
import { GroupMembersService } from "../../../group/services/group-members.service";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-form-payment',
  templateUrl: './form-payment.component.html',
  styleUrls: ['./form-payment.component.css']
})
export class FormPaymentComponent implements OnInit {
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

  memberFormGroup = this._formBuilder.group({
    memberCtrl: ['', Validators.required],
  });

  groupMembers: any[] = [];

  stepperOrientation: 'horizontal' | 'vertical' = 'vertical';

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private groupMembersService: GroupMembersService,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.stepperOrientation = result.matches ? 'vertical' : 'horizontal';
      });
  }

  onGroupSelectionChange(event: any) {
    this.groupChange.emit(event.value);
    this.selectedExpense = null;
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
    this.memberFormGroup.reset();
    this.groupMembers = [];

    if (event.value) {
      this.groupMembersService.getGroupMembers(event.value).subscribe(members => {
        this.groupMembers = members;
      });
    }
  }

  onExpenseSelectionChange(event: any) {
    this.selectedExpense = this.expenses.find(e => e.id === event.value);
    this.thirdFormGroup.reset();
    this.memberFormGroup.reset();
  }

  get maxAmount(): number {
    return this.selectedExpense ? this.selectedExpense.amount : 0;
  }
  get canSubmit(): boolean {
    return !!this.selectedExpense && this.thirdFormGroup.valid && this.memberFormGroup.valid;
  }
  onSubmit() {
    if (!this.selectedExpense) return;

    const payment = new PaymentEntity();
    payment.description = this.thirdFormGroup.value.description ?? '';
    payment.amount = +(this.thirdFormGroup.value.amount ?? 0);
    payment.status = PaymentStatus.PENDING;
    payment.userId = +(this.memberFormGroup.value.memberCtrl ?? 0);
    payment.expenseId = this.selectedExpense.id;

    this.onAddPayment.emit(payment);
    this.router.navigate(['/outgoing']);
  }
}
