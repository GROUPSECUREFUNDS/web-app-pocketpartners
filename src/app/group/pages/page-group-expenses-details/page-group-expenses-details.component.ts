import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { ExpensesService } from '../../../expenses/services/expenses.service';
import { PaymentService } from '../../../payments/services/payment.service';
import { AuthenticationService } from '../../../iam/services/authentication.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-page-group-expenses-details',
  templateUrl: './page-group-expenses-details.component.html',
  styleUrls: ['./page-group-expenses-details.component.css'] // Corregido de styleUrl a styleUrls
})
export class PageGroupExpensesDetailsComponent implements OnInit {
  idOfUser = 1;
  id: number = 0;
  group: any = {};
  totalExpenses: number = 0;
  totalOfMembers: number = 0;
  amountOfPayToYou: number = 0;
  currentCurrency: string = 'PEN';
  expensesPieChart!: Chart<"pie", number[], string>;
  expenses: any[] = []; // Lista para almacenar los gastos
  allPaymentsCompleted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private expensesService: ExpensesService,
    private paymentService: PaymentService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.id = parseInt(this.route.snapshot.url[1].path, 10);
    this.loadGroupDetails();
    this.loadExpenses();
  }

  loadGroupDetails() {
    this.groupService.getById(this.id).subscribe((group: any) => {
      this.group = group;
      this.currentCurrency = group.currency[0].code;
      this.calculateAmountToYou();
    });
  }

  loadExpenses() {
    this.expensesService.getExpensesByGroupId(this.id).subscribe((expenses: any[]) => {
      this.expenses = expenses.map(expense => ({ ...expense, checked: false }));
      this.updateExpensesPieChart();
    });
  }

  calculateAmountToYou() {
    // Lógica para calcular el total a pagar
  }

  onExpenseCheckChange() {
    this.updateExpensesPieChart();
    this.checkAllPaymentsCompleted();
  }

  updateExpensesPieChart() {
    const filteredExpenses = this.expenses.filter(expense => !expense.checked);
    const expenseAmounts = filteredExpenses.map(expense => expense.amount);
    const expenseLabels = filteredExpenses.map(expense => expense.name || 'Gasto sin nombre');

    if (this.expensesPieChart) {
      this.expensesPieChart.destroy();
    }

    const canvas = document.getElementById('expensesPieChart') as HTMLCanvasElement;
    this.expensesPieChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: expenseLabels,
        datasets: [{
          data: expenseAmounts,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
      },
      options: {}
    });
  }

  checkAllPaymentsCompleted() {
    // Check if all expenses are checked
    this.allPaymentsCompleted = this.expenses.every(expense => expense.checked);
  }

  goBack() {
    window.history.back();
  }
}

