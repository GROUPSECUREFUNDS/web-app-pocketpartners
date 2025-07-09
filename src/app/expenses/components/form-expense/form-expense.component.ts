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
  isLoading: boolean = false;
  @Input() user: PartnerEntity = new PartnerEntity();
  @Input() joinedGroups: any;
  private Expense = new ExpensesEntity();
  @Output() onAddExpense: EventEmitter<ExpensesEntity> = new EventEmitter<ExpensesEntity>();

  constructor(private _formBuilder: FormBuilder, private router: Router, private paymentService: PaymentService, private groupMembersService: GroupMembersService, private expenseService: ExpensesService, private groupOperationService: GroupOperationsService,
    private groupService: GroupService
  ) { }

  onSubmit() {
    this.isLoading = true;
    // Configurar los datos de Expense
    this.Expense.name = this.firstFormGroup.value.firstCtrl as string;
    this.Expense.amount = parseFloat(<string>this.thirdFormGroup.value.firstCtrl);
    this.Expense.userId = this.user.id;
    this.Expense.groupId = parseInt(<string>this.fourthFormGroup.value.firstCtrl, 10);
    this.Expense.dueDate = new Date(this.fifthFormGroup.value.dueDateCtrl!);

    // Emitir el nuevo gasto
    this.onAddExpense.emit(this.Expense);
  }


}
