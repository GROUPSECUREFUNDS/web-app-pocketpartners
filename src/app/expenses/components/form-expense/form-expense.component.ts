import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExpensesEntity } from '../../model/expenses.entity';
import { forkJoin, of } from 'rxjs';
import { catchError, retry, switchMap } from 'rxjs/operators';
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
  styleUrls: ['./form-expense.component.css']
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
    // Set up the Expense data
    this.Expense.name = this.firstFormGroup.value.firstCtrl as string;
    this.Expense.amount = parseFloat(<string>this.thirdFormGroup.value.firstCtrl);
    this.Expense.userId = this.user.id;
    this.Expense.groupId = parseInt(<string>this.fourthFormGroup.value.firstCtrl, 10);
    this.Expense.dueDate = new Date(this.fifthFormGroup.value.dueDateCtrl!);

    // Emit the new expense
    this.onAddExpense.emit(this.Expense);

    const groupId = this.Expense.groupId;

    // Fetch members and process expense and payments
    this.groupMembersService.getGroupMembers(groupId).pipe(
      switchMap((members: PartnerEntity[]) => {
        return this.expenseService.getExpensesByGroupId(groupId).pipe(
          switchMap((expenses: ExpensesEntity[]) => {
            const paymentAmount = this.Expense.amount / members.length;
            const expenseId = expenses.length ? expenses[expenses.length - 1].id : null;

            if (expenseId === null) {
              // Handle case where expenseId is not found
              throw new Error('Expense ID not found');
            }

            // Continue with group operation logic...
            const groupOperation = new OperationEntity();
            // Further processing and API calls...

            return of(true); // Replace with actual return logic
          }),
          catchError(err => {
            console.error('Error fetching expenses:', err);
            return of(null); // Handle error gracefully
          })
        );
      }),
      catchError(err => {
        console.error('Error fetching group members:', err);
        return of(null); // Handle error gracefully
      })
    ).subscribe(result => {
      if (result) {
        // Handle successful completion
        console.log('Operation completed successfully');
      } else {
        // Handle failure
        console.error('Operation failed');
      }
    });
  }

}
