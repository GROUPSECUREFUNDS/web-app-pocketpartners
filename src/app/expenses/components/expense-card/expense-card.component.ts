import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExpensesEntity } from '../../model/expenses.entity';
import { ContactService } from "../../../contacts/services/contact.service";
import { ExpensesService } from '../../services/expenses.service';

@Component({
  selector: 'app-expense-card',
  templateUrl: './expense-card.component.html',
  styleUrls: ['./expense-card.component.css']
})
export class ExpenseCardComponent implements OnInit {
  @Input() expense: ExpensesEntity = new ExpensesEntity();
  @Input() isFirst: boolean = false;
  @Output() expenseDeleted: EventEmitter<number> = new EventEmitter<number>();
  @Output() showAllRequested: EventEmitter<void> = new EventEmitter<void>();
  @Output() hideRequested: EventEmitter<number> = new EventEmitter<number>();

  user: any;

  constructor(
    private userService: ContactService,
    private expensesService: ExpensesService
  ) { }

  ngOnInit() {
    if (this.expense && this.expense.userId) {
      this.userService.getUserById(this.expense.userId).subscribe(user => {
        this.user = user;
      });
    }
  }

  deleteExpense(expenseId: number): void {
    this.expensesService.deleteExpenseById(expenseId).subscribe(
      () => {
        this.expenseDeleted.emit(expenseId);
      },
      (error) => {
        console.error('Error deleting expense:', error);
      }
    );
  }

  hideCard(): void {
    this.hideRequested.emit(this.expense.id);
  }

  requestShowAll(): void {
    this.showAllRequested.emit();
  }
}
