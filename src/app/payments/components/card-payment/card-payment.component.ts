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
import {PaymentDetailsMode} from "../../model/payment-details-mode";
import {AuthenticationService} from "../../../iam/services/authentication.service";
import {firstValueFrom, forkJoin} from "rxjs";
import {switchMap} from "rxjs/operators";

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
  member:ContactEntity;
  isLoading: boolean = false;

  constructor(
    private expenseService:ExpensesService,
    private groupService:GroupService,
    private contactService:ContactService,
    private dialog:MatDialog,
    private paymentService:PaymentService,
    private router:Router,
    private authService:AuthenticationService
    ) {
    this.expense = new ExpensesEntity();
    this.group = new GroupEntity();
    this.admin = new ContactEntity();
    this.member = new ContactEntity();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['payment'] && this.payment?.expenseId) {
      this.fetchData();
    }
  }

  fetchData(){
    this.isLoading = true;

    this.expenseService.getExpenseById(this.payment.expenseId).pipe(
      switchMap(expenseData => {
        this.expense = expenseData;
        return this.groupService.getById(expenseData.groupId);
      }),
      switchMap(groupData => {
        this.group = groupData;
        return forkJoin({
          admin: this.contactService.getUserById(groupData.adminId),
          member: this.contactService.getUserById(this.payment.userId)
        });
      })
    ).subscribe({
      next: ({admin, member}) => {
        this.admin = admin;
        this.member = member;
      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
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
  async navigateToReceipts(){
    let userId = await firstValueFrom(this.authService.currentUserId);
    this.router.navigate([`/payments/${this.payment.id}/receipts`], {
        queryParams: {
          mode: this.payment.userId === userId?
              PaymentDetailsMode.PRIVATE:
              PaymentDetailsMode.PUBLIC
        }
      }).then();
  }
  protected readonly PaymentStatus = PaymentStatus;
  protected readonly PaymentCardMode = PaymentCardMode;
}
