import { Component, OnInit } from '@angular/core';
import { ExpensesService } from '../../services/expenses.service';
import { ExpensesEntity } from '../../model/expenses.entity';

@Component({
  selector: 'app-page-expenses',
  templateUrl: './page-expenses.component.html',
  styleUrls: ['./page-expenses.component.css']
})
export class PageExpensesComponent implements OnInit {
  public expenses: ExpensesEntity[] = [];
  public searchText: string = '';
  public isLoading: boolean = true;
  public userId: number = 0;
  public showHidden: boolean = false;

  constructor(public expensesService: ExpensesService) { }

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    this.userId = storedUserId ? parseInt(storedUserId, 10) : 0;
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.isLoading = true;
    this.expensesService.getExpensesByUserId(this.userId).subscribe({
      next: (expenses: ExpensesEntity[]) => {
        this.expenses = expenses;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching expenses:', err);
        this.isLoading = false;
      }
    });
  }

  handleExpenseDeleted(expenseId: number): void {
    this.expenses = this.expenses.filter(expense => expense.id !== expenseId);
    this.loadExpenses();
  }

  filteredExpenses(): ExpensesEntity[] {
    if (this.showHidden) {
      return [];
    }

    return this.expenses.filter(expense =>
      expense.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
  toggleShowHidden(): void {
    this.showHidden = !this.showHidden;
  }
}
