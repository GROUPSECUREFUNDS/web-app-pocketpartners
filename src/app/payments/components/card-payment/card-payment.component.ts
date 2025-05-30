import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {PaymentEntity} from "../../model/payment-entity";
import {ExpensesEntity} from "../../../expenses/model/expenses.entity";
import {GroupEntity} from "../../../group/model/group.entity";
import {ContactEntity} from "../../../contacts/model/contact.entity";
import {ExpensesService} from "../../../expenses/services/expenses.service";
import {GroupService} from "../../../group/services/group.service";
import {ContactService} from "../../../contacts/services/contact.service";
import {PaymentStatus} from "../../model/payment-status";
import {MatDialog} from "@angular/material/dialog";
import {AddReceiptsComponent} from "../add-receipts/add-receipts.component";
import {PaymentService} from "../../services/payment.service";
import {Router} from "@angular/router";
import {PaymentCardMode} from "../../model/payment-card-mode";

@Component({
  selector: 'app-card-payment',
  templateUrl: './card-payment.component.html',
  styleUrl: './card-payment.component.css'
})
export class CardPaymentComponent{
  @Input() payment!:PaymentEntity;
  @Input() mode!:PaymentCardMode;
  @Output() onPaymentComplete:EventEmitter<any> = new EventEmitter<any>();

  expense:ExpensesEntity;
  group:GroupEntity;
  admin: ContactEntity;

  constructor(
    private expenseService:ExpensesService,
    private groupService:GroupService,
    private contactService:ContactService,
    private dialog:MatDialog,
    private paymentService:PaymentService,
    private router:Router
    ) {
    this.expense = new ExpensesEntity();
    this.group = new GroupEntity();
    this.admin = new ContactEntity();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['payment'] && this.payment?.expenseId) {
      this.fetchData();
    }
  }

  fetchData(){
    this.expenseService.getExpenseById(this.payment.expenseId).subscribe((expenseData)=>{
      this.expense = expenseData;
      this.groupService.getById(this.expense.groupId).subscribe((groupData)=>{
        this.group = groupData;
        this.contactService.getUserById(this.group.adminId).subscribe((contactData)=>{
          this.admin = contactData;
        })
      })
    })
  }

  showAddReceipts(){
    this.dialog.open(AddReceiptsComponent,{
      data:{
        payment: this.payment
      }
    });
    this.markPayment();
  }
  markPayment(){
      this.paymentService.postCompletePaymentById(this.payment.id).subscribe((data)=>{
          this.onPaymentComplete.emit(data);
      })
  }
  navigateToReceipts(){
      this.router.navigate([`/payments/${this.payment.id}/receipts`]).then();
  }
  protected readonly PaymentStatus = PaymentStatus;
  protected readonly PaymentCardMode = PaymentCardMode;
}
