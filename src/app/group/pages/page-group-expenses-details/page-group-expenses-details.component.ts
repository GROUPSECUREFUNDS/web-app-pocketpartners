import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PaymentService} from "../../../payments/services/payment.service";
import {ExpensesEntity} from "../../../expenses/model/expenses.entity";
import {PaymentEntity} from "../../../payments/model/payment-entity";
import {ExpensesService} from "../../../expenses/services/expenses.service";
import {GroupService} from "../../services/group.service";
import {PaymentStatus} from "../../../payments/model/payment-status";
import {ReceiptEntity} from "../../../payments/model/receipt-entity";
import {ReceiptService} from "../../../payments/services/receipt.service";
import {ImageService} from "../../../shared/services/image.service";
import {MatDialog} from "@angular/material/dialog";
import {AddReceiptsComponent} from "../../../payments/components/add-receipts/add-receipts.component";


@Component({
  selector: 'app-page-group-expenses-details',
  templateUrl: './page-group-expenses-details.component.html',
  styleUrls: ['./page-group-expenses-details.component.css'] // Corregido de styleUrl a styleUrls
})

export class PageGroupExpensesDetailsComponent implements OnInit {
  groupMembers: any[] = [];
  expense: ExpensesEntity | undefined;
  payments: PaymentEntity[] = [];
  receipts: ReceiptEntity [] = [];

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private expenseService: ExpensesService,
    private groupService: GroupService,
    private receiptService: ReceiptService,
    private imageService: ImageService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    const expenseId = this.route.snapshot.paramMap.get('id');
    if (expenseId) {
      this.expenseService.getExpenseById(+expenseId).subscribe(exp => {
        this.expense = exp;
        if (exp.groupId) {
          this.groupService.getAllMembersByIdGroup(exp.groupId).subscribe(members => {
            this.groupMembers = members;
          });
        }
        // Cargar recibos cuando se obtiene el expense
        this.fetchReceipts(+expenseId);
      });
      this.paymentService.getPaymentByExpenseId(+expenseId).subscribe(payments => {
        this.payments = payments;
      });
    }
  }
  fetchReceipts(expenseId: number) {
    this.receiptService.getReceiptsByExpenseId(expenseId).subscribe(receipts => {
      this.receipts = receipts.map(receipt => {
        if (receipt.imagePath) {
          receipt.imagePath = this.imageService.getImageUrlById(receipt.imagePath);
        }
        receipt.issueDate = new Date(receipt.issueDate);
        return receipt;
      });
    });
  }

  showAddReceiptDialog() {
    if (!this.expense) return;
    this.dialog.open(AddReceiptsComponent, {
      data: {
        payment: null,
        expense: this.expense
      }
    }).afterClosed().subscribe(() => {
      if (this.expense) {
        this.fetchReceipts(this.expense.id);
      }
    });
  }

  getStatusKey(status: string | number): string {
    if (typeof status === 'number') {
      return status === 1 ? PaymentStatus.COMPLETED : PaymentStatus.PENDING;
    }
    const s = (status + '').trim().toUpperCase();
    return s === PaymentStatus.COMPLETED ? PaymentStatus.COMPLETED : PaymentStatus.PENDING;
  }

  getStatusClass(status: string | number): string {
    return this.getStatusKey(status) === PaymentStatus.COMPLETED ? 'btn-success' : 'btn-danger';
  }

  getStatusLabel(status: string | number): string {
    return this.getStatusKey(status) === PaymentStatus.COMPLETED ? 'Completado' : 'Pendiente';
  }

  navigateToReceipts(payment: PaymentEntity) {
    this.router.navigate([`/payments/${payment.id}/receipts`]);
  }
}

