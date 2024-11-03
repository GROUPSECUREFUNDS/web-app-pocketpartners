import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExpensesEntity } from '../../model/expenses.entity';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PartnerEntity } from "../../../pockets/model/partnerEntity";
import { OperationEntity } from "../../../group/model/operation-entity";
import { PaymentEntity } from "../../../payments/model/payment-entity";
import { PaymentService } from "../../../payments/services/payment.service";
import { GroupMembersService } from "../../../group/services/group-members.service";
import { ExpensesService } from "../../services/expenses.service";
import { GroupOperationsService } from "../../../group/services/group-operations.service";
import { GroupService } from "../../../group/services/group.service";
@Component({
  selector: 'app-form-expense',
  templateUrl: './form-expense.component.html',
  styleUrl: './form-expense.component.css'
})
export class FormExpenseComponent {
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
  fifthFormGroup = this._formBuilder.group({
    dueDateCtrl: ['', Validators.required],
  });

  @Input() user: PartnerEntity = new PartnerEntity();
  @Input() joinedGroups: any;
  private Expense = new ExpensesEntity();
  @Output() onAddExpense: EventEmitter<ExpensesEntity> = new EventEmitter<ExpensesEntity>();
  constructor(private _formBuilder: FormBuilder, private router: Router, private paymentService: PaymentService, private groupMembersService: GroupMembersService, private expenseService: ExpensesService, private groupOperationService: GroupOperationsService,
    private groupService: GroupService
  ) { }

  onSubmit() {
    this.Expense.name = this.firstFormGroup.value.firstCtrl as string;
    this.Expense.amount = this.thirdFormGroup.value.firstCtrl as unknown as number;
    this.Expense.userId = this.user.id;
    this.Expense.groupId = this.fourthFormGroup.value.firstCtrl as unknown as number;
    this.Expense.dueDate = this.fifthFormGroup.value.dueDateCtrl as unknown as Date;
    this.onAddExpense.emit(this.Expense);

    const groupId = this.Expense.groupId;
    this.groupService.getAllMembersByIdGroup(groupId).subscribe((members: any[]) => {
      this.expenseService.getExpensesByGroupId(groupId).subscribe((expenses: any) => {
        const paymentAmount = this.Expense.amount / members.length;
        const expenseId = expenses[expenses.length - 1].id;
        const groupOperation = new OperationEntity();

        console.log(expenses);
        members.forEach((member: any) => {
          const payment = new PaymentEntity();
          payment.description = this.firstFormGroup.value.firstCtrl as string;
          const desc = this.firstFormGroup.value.firstCtrl as string;

          this.paymentService.create({ description: desc, amount: paymentAmount, userId: member.userId, expenseId: expenseId }).subscribe((payment: any) => {
            const paymentId = payment.id;

            const groupID = this.fourthFormGroup.value.firstCtrl as unknown as number;
            this.groupOperationService.create({ groupId: groupID, expenseId: expenseId, paymentId: paymentId }).subscribe();
          });
        });
      });
    });

  }

}
