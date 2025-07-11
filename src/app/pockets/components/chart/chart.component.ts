import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';
import { ExpensesService } from "../../../expenses/services/expenses.service";
import { ExpensesEntity } from "../../../expenses/model/expenses.entity";
import { ContactEntity } from "../../../contacts/model/contact.entity";
import { ContactService } from "../../../contacts/services/contact.service";
import { Subscription } from 'rxjs';
import {AuthenticationService} from "../../../iam/services/authentication.service";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnDestroy {

  dataMonth: string[] = [];
  dataAmount: number[] = [];
  dataColor: string[] = [];
  public users: { [key: number]: ContactEntity } = {};
  private subscriptions: Subscription[] = [];

  constructor(
    private expensesService: ExpensesService,
    private userService: ContactService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {

    const authSubscription = this.authenticationService.currentUserId
      .subscribe((userId: number) => {
        if (userId) {
          this.loadExpenses(userId);
        }
      });

    this.subscriptions.push(authSubscription);
  }

  loadExpenses(userId: number) {
    const expensesSubscription = this.expensesService.getExpensesByUserId(userId)
      .subscribe((expenses: ExpensesEntity[]) => {
        expenses.forEach(expense => {
          if (expense.createdAt) {
            this.dataMonth.push(this.formatDate(expense.createdAt));
            this.dataAmount.push(expense.amount);
            this.dataColor.push(this.getRandomColor());
          }
        });
        this.showChart();
      });

    this.subscriptions.push(expensesSubscription);
  }

  getUserById(userId: number) {
    if (!this.users[userId]) {
      const userSubscription = this.userService.getUserById(userId)
        .subscribe((user: ContactEntity) => {
          console.log("User: ", user);
          this.users[userId] = user;
        });

      this.subscriptions.push(userSubscription);
    }
  }

  showChart() {
    new Chart('myChart', {
      type: 'line',
      data: {
        labels: this.dataMonth,
        datasets: [{
          label: '# of Money Used',
          data: this.dataAmount,
          borderWidth: 1,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)'
        }]
      },
      options: {
        responsive:true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-GB');
  }

  getRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
