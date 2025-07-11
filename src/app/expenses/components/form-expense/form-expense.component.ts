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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



import { GroupService } from "../../../group/services/group.service";
@Component({
  selector: 'app-form-expense',
  templateUrl: './form-expense.component.html',
  styleUrls: ['./form-expense.component.css']
})
export class FormExpenseComponent {
  isLoading: boolean = false;
  errorMessage: string = '';
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
    this.isLoading = true;
    this.errorMessage = '';
    // Configurar los datos de Expense
    this.Expense.name = this.firstFormGroup.value.firstCtrl as string;
    this.Expense.amount = parseFloat(<string>this.thirdFormGroup.value.firstCtrl);
    this.Expense.userId = this.user.id;
    this.Expense.groupId = parseInt(<string>this.fourthFormGroup.value.firstCtrl, 10);
    this.Expense.dueDate = new Date(this.fifthFormGroup.value.dueDateCtrl!);

    // Emitir el nuevo gasto
    this.onAddExpense.emit(this.Expense);

    const groupId = this.Expense.groupId;

    this.groupMembersService.getGroupMembers(groupId).pipe(
      switchMap((members: PartnerEntity[]) => {
        if (members.length === 0) {
          throw new Error('No se encontraron miembros en el grupo');
        }

        return this.expenseService.getExpensesByGroupId(groupId).pipe(
          switchMap((expenses: ExpensesEntity[]) => {
            if (expenses.length === 0) {
              throw new Error('No se encontraron gastos previos');
            }

            const expenseId = expenses[expenses.length - 1].id;
            const paymentAmount = this.Expense.amount / members.length;

            // Crear observables para la creación de `PaymentEntity` y `OperationEntity`
            const paymentObservables = members.map(member => {
              const payment = new PaymentEntity();
              payment.description = this.firstFormGroup.value.firstCtrl as string;
              payment.amount = paymentAmount;
              payment.userId = member.id;
              payment.expenseId = expenseId;

              return this.paymentService.postPayment(payment).pipe(
                retry(2), // Reintentar la creación del pago hasta 2 veces
                switchMap((createdPayment: PaymentEntity) => {
                  const operation = new OperationEntity();
                  operation.groupId = groupId;
                  operation.expenseId = expenseId;
                  operation.paymentId = createdPayment.id;

                  return this.groupOperationService.postOperation(operation).pipe(
                    retry(2), // Reintentar la creación de la operación hasta 2 veces
                    catchError(error => {
                      console.error(`Error creando la operación para el pago ${createdPayment.id}:`, error);
                      return of(null); // Continuar si una operación falla
                    })
                  );
                }),
                catchError(error => {
                  console.error('Error creando pago:', error);
                  return of(null); // Continuar si un pago falla
                })
              );
            });

            // Ejecutar todas las solicitudes de pago y operación en paralelo
            return forkJoin(paymentObservables);
          }),
          catchError(err => {
            console.error('Error al obtener los gastos del grupo:', err);
            this.isLoading = false;
            return of(null); // Manejar error en la obtención de gastos
          })
        );
      }),
      catchError(err => {
        console.error('Error al obtener los miembros del grupo:', err);
        this.isLoading = false;
        return of(null); // Manejar error en la obtención de miembros
      })
    ).subscribe(results => {
      this.isLoading = false;
      if (results && results.every(result => result !== null)) {
        console.log('Todos los pagos y operaciones se crearon exitosamente:', results);
      } else {
        console.error('Una o más operaciones fallaron');
      }
    });
  }


}
