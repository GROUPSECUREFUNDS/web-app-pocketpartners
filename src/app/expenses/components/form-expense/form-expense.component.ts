import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExpensesEntity } from '../../model/expenses.entity';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PartnerEntity } from "../../../pockets/model/partnerEntity";
import { forkJoin, of } from 'rxjs';
import { catchError, retry, switchMap } from 'rxjs/operators';
import { PaymentService } from "../../../payments/services/payment.service";
import { GroupMembersService } from "../../../group/services/group-members.service";
import { ExpensesService } from "../../services/expenses.service";
import { GroupOperationsService } from "../../../group/services/group-operations.service";

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

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private paymentService: PaymentService,
    private groupMembersService: GroupMembersService,
    private expenseService: ExpensesService,
    private groupOperationService: GroupOperationsService
  ) {}

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

    this.groupMembersService.getAllMembersByIdGroup(groupId).pipe(
      switchMap((members: any[]) =>
        this.expenseService.getExpensesByGroupId(groupId).pipe(
          switchMap((expenses: any) => {
            const paymentAmount = this.Expense.amount / members.length;
            const expenseId = expenses[expenses.length - 1]?.id; // Usar optional chaining

            // Crear un array de observables para los pagos
            const paymentObservables = members.map((member: any) => {
              return this.paymentService.create({
                description: this.firstFormGroup.value.firstCtrl as string,
                amount: paymentAmount,
                userId: member.userId,
                expenseId: expenseId
              }).pipe(
                retry(2), // Retry up to 1 times for each payment creation
                switchMap((payment: any) =>
                  this.groupOperationService.create({
                    groupId: groupId,
                    expenseId: expenseId,
                    paymentId: payment.id
                  }).pipe(
                    retry(2) // Retry up to 1 times for each operation creation
                  )
                ),
                catchError((error) => {
                  console.error('Error creating payment or operation:', error);
                  return of(null); // Continue with other operations even if one fails
                })
              );
            });

            // Usar forkJoin para esperar a que todos los pagos y operaciones se creen
            return forkJoin(paymentObservables);
          })
        )
      )
    ).subscribe({
      next: (results) => {
        console.log('All payments and operations created successfully:', results);
      },
      error: (err) => {
        console.error('Error during the expense creation flow:', err);
      }
    });
  }
}
