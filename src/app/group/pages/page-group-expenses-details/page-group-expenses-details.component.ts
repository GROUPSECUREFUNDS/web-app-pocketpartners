import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PaymentService} from "../../../payments/services/payment.service";
import {ExpensesEntity} from "../../../expenses/model/expenses.entity";
import {PaymentEntity} from "../../../payments/model/payment-entity";
import {ExpensesService} from "../../../expenses/services/expenses.service";
import {GroupService} from "../../services/group.service";


@Component({
  selector: 'app-page-group-expenses-details',
  templateUrl: './page-group-expenses-details.component.html',
  styleUrls: ['./page-group-expenses-details.component.css'] // Corregido de styleUrl a styleUrls
})

export class PageGroupExpensesDetailsComponent implements OnInit {
  groupMembers: any[] = [];
  expense: ExpensesEntity | undefined;
  payments: PaymentEntity[] = [];

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private expenseService: ExpensesService,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    const expenseId = this.route.snapshot.paramMap.get('id');
    if (expenseId) {
      this.expenseService.getExpenseById(+expenseId).subscribe(exp => {
        this.expense = exp;
        // Una vez que tienes el expense, obtén los miembros del grupo
        if (exp.groupId) {
          this.groupService.getAllMembersByIdGroup(exp.groupId).subscribe(members => {
            this.groupMembers = members;
          });
        }
      });
      this.paymentService.getPaymentByExpenseId(+expenseId).subscribe(payments => {
        this.payments = payments;
      });
    }
  }
}

