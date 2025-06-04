
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExpensesEntity } from '../../model/expenses.entity';
import { ContactService } from "../../../contacts/services/contact.service";
import { ExpensesService } from '../../services/expenses.service';


export interface Expense {
  id: number;
  title: string;
  description: string;
  amount: number;
}
@Component({
  selector: 'app-expense-card',
  templateUrl: './expense-card.component.html',
  styleUrls: ['./expense-card.component.css']
})
export class ExpenseCardComponent implements OnInit {
  @Input() expense: ExpensesEntity = new ExpensesEntity();
  @Input() isFirst: boolean = false;
  @Output() expenseDeleted: EventEmitter<number> = new EventEmitter<number>();
  user: any;

  // Visibilidad individual


  // Solo una instancia muestra el botón global
  static showToggleButtonRendered = false;
  showToggleButton = false;
  visibleCards: { [key: number]: boolean } = {};
  constructor(
    private userService: ContactService,
    private expensesService: ExpensesService
  ) { }

  ngOnInit() {
    if (this.expense && this.expense.userId) {
      this.userService.getUserById(this.expense.userId).subscribe(user => {
        this.user = user;
        console.log('User loaded:', this.user);
      });
    }
    // Mostrar todos los cards al cargar
    if (this.expense && this.expense.id) {
      this.visibleCards[this.expense.id] = true;
    }
  }
  // Oculta un card por ID
  hideCard(id: number): void {
    this.visibleCards[id] = false;
  }

  // Muestra todos los cards
  showAllCards(): void {
    for (const id in this.visibleCards) {
      this.visibleCards[id] = true;
    }
  }

  deleteExpense(expenseId: number): void {
    this.expensesService.deleteExpenseById(expenseId).subscribe(
      () => {
        console.log(`Expense with ID ${expenseId} deleted successfully.`);
        this.expenseDeleted.emit(expenseId);
      },
      (error) => {
        console.error('Error deleting expense:', error);
      }
    );
  }
}
