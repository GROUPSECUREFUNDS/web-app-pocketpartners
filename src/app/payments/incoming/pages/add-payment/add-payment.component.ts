import { Component, OnInit } from '@angular/core';
import { PaymentService } from "../../../services/payment.service";
import { PartnerService } from "../../../../pockets/services/Partner.service";
import { PartnerEntity } from "../../../../pockets/model/partnerEntity";
import { PaymentEntity } from "../../../model/payment-entity";
import { AuthenticationService } from "../../../../iam/services/authentication.service";
import { GroupOperationsService } from '../../../../group/services/group-operations.service';
import { GroupService } from '../../../../group/services/group.service';
import {ExpensesService} from "../../../../expenses/services/expenses.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.css']
})
export class AddPaymentComponent implements OnInit {
  userId: number = 0;
  joinedGroups: any = [];
  pendingPayments: any = [];
  expenses: any[] = [];
  constructor(
    private partnerService: PartnerService,
    private paymentService: PaymentService,
    private authenticationService: AuthenticationService,
    private groupService: GroupService,
    private groupOperationService: GroupOperationsService,
    private expensesService: ExpensesService,
    private router: Router,
  ) { }
  user: PartnerEntity = new PartnerEntity();

  ngOnInit(): void {
    this.authenticationService.currentUserId.subscribe((userId: any) => {
      this.userId = userId;
      this.partnerService.getPartnerById(userId).subscribe((partner: any) => {
        this.user = partner; // <-- Asigna el usuario aquí
        this.paymentService.getJoinedUserGroups(userId).subscribe((groups: any) => {
          groups.forEach((group: any) => {
            this.groupService.getById(group.groupId).subscribe((group: any) => {
              this.joinedGroups.push(group);
            });
          });
        });
      });
    });
  }

  onGroupChange(groupId: number): void {
    this.expenses = [];
    this.expensesService.getExpensesByGroupId(groupId).subscribe((expenses: any[]) => {
      this.expenses = expenses;
    });
  }

  onSubmit(payment: PaymentEntity) {
    if (!payment.userId || !payment.expenseId) {
      console.error('Faltan userId o expenseId en el payment');
      return;
    }
    this.paymentService.postPayment(payment).subscribe({
      next: () => this.router.navigate(['/outgoing']),
      error: err => console.error('Error al guardar el payment', err)
    });
  }
}
