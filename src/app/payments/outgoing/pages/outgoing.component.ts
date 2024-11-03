import { Component, OnInit } from '@angular/core';
import { GroupEntity } from "../../../group/model/group.entity";
import { PaymentEntity } from "../../model/payment-entity";
import { ContactEntity } from "../../../contacts/model/contact.entity";
import { PaymentService } from "../../services/payment.service";
import { ContactService } from "../../../contacts/services/contact.service";
import { OperationEntity } from "../../../group/model/operation-entity";
import { ExpensesService } from "../../../expenses/services/expenses.service";
import { GroupOperationsService } from '../../../group/services/group-operations.service';
import { GroupService } from '../../../group/services/group.service';

@Component({
  selector: 'app-pages',
  templateUrl: './outgoing.component.html',
  styleUrl: './outgoing.component.css'
})
export class OutgoingComponent implements OnInit {
  public groups: GroupEntity[] = [];
  public groupPayments: { [key: number]: PaymentEntity[] } = {};
  paymentsMade: any[] = [];
  paymentsToDo: any[] = [];
  public users: { [key: number]: ContactEntity } = {};
  dataLoaded: Promise<boolean> = new Promise((resolve) => resolve(false));

  constructor(
    private groupService: GroupService,
    private groupOperations: GroupOperationsService,
    private paymentService: PaymentService,
    private userService: ContactService,
    private expenseService: ExpensesService
  ) { }

  getAllGroups() {
    this.groupService.getAll()
      .subscribe((groups: any) => {
        this.groups = groups;
        this.dataLoaded = Promise.resolve(true);
      });
  }

  getPaymentsMade() {
    this.paymentService.getPaymentByUserIdAndStatus(1, 'COMPLETED')
      .subscribe((payments: any) => {
        try {
          this.paymentsMade = payments;
          console.log("Payments made: ", this.paymentsMade);
          payments.forEach((paymentData:any) => {
            this.expenseService.getExpenseById(paymentData.expenseId).subscribe((expense: any) => {
              
              paymentData.expense = expense;
              this.groupService.getById(expense.groupId).subscribe((group: any) => {
                paymentData.group = group;
              });
              console.log("Payments made: ", this.paymentsMade);
            })
          });
        } catch (e) {
          console.error(e);
        }
      });
  }

  getPaymentsToDo() {
    this.paymentService.getPaymentByUserIdAndStatus(1, 'PENDING')
      .subscribe((payments: any) => {
        try {
          this.paymentsToDo = payments;
          console.log("Payments to do: ", this.paymentsToDo);
          payments.forEach((paymentData:any) => {
            this.expenseService.getExpenseById(paymentData.expenseId).subscribe((expense: any) => {
              
              paymentData.expense = expense;
              this.groupService.getById(expense.groupId).subscribe((group: any) => {
                paymentData.group = group;
                this.groups.push(group);
              });
              console.log("Payments to do: ", this.paymentsToDo);
            })
          });
        } catch (e) {
          console.error(e);
        }
      });
  }

  ngOnInit() {
    this.getAllGroups();
    this.getPaymentsMade();
    this.getPaymentsToDo();
  }
}
