import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { GroupService } from '../../services/group.service';
import { GroupEntity } from '../../model/group.entity';
import { Chart } from 'chart.js/auto';
import { ExpensesService } from '../../../expenses/services/expenses.service';
import { PaymentService } from '../../../payments/services/payment.service';
import { AuthenticationService } from '../../../iam/services/authentication.service';
import { PartnerService } from '../../../pockets/services/Partner.service';
import { GroupMembersService } from '../../services/group-members.service';

@Component({
  selector: 'app-page-group-details',
  templateUrl: './page-group-details.component.html',
  styleUrls: ['./page-group-details.component.css']
})
export class PageGroupDetailsComponent implements OnInit {
  idOfUser = 1;
  id: number = 0;
  group: GroupEntity = new GroupEntity();
  groupMembers: any[] = [];
  totalExpenses: number = 0;
  totalOfMembers: number = 0;
  amountOfPayToYou: number = 0;
  amountEachMemberShouldPay: number = 0;
  paidMembers: Set<number> = new Set<number>();
  pieChart!: Chart<"pie", number[], string>;
  invitationToken: string = '';  
  currentUserId!: number;

  constructor(
    private route: ActivatedRoute,
    private groupMembersService: GroupMembersService,
    private groupService: GroupService,
    private expensesService: ExpensesService,
    private paymentService: PaymentService,
    private authenticationService: AuthenticationService,
    private partnerService: PartnerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authenticationService.currUserInformation.subscribe((userInfo: any) => {
      this.idOfUser = userInfo.id;
    });

    this.id = parseInt(this.route.snapshot.url[1].path, 10);

    if (this.id) {
      this.groupService.getById(this.id).subscribe((group: any) => {
        this.group = group;
        this.calculateAmountToYou();
        this.getAllGroupMembers();
      });
    }

    this.authenticationService.currentUserId.subscribe((userId: any) => {
      this.currentUserId = userId;
    } );
    console.log(this.currentUserId);
    console.log(this.idOfUser);
    console.log(this.group.adminId);
  }


  
  getAllGroupMembers() {
    this.groupService.getAllMembersByIdGroup(this.group.id).subscribe((members: any) => {
      this.groupMembers = members;
      this.totalOfMembers = members.length;
    });
  }

  calculateAmountToYou() {
    let totalExpenses = 0;
    let totalCompletedPayments = 0;
    this.expensesService.getExpensesByGroupId(this.group.id).subscribe((expenses: any) => {
      expenses.forEach((expense: any) => {
        if (expense.userId == this.idOfUser) {
          totalExpenses += expense.amount;
        }
        this.totalExpenses += expense.amount;
        this.paymentService.getPaymentByExpenseId(expense.id).subscribe((payments: any) => {
          payments.forEach((payment: any) => {
            if (payment.status !== 'completed' && payment.userId == this.idOfUser) {
              totalCompletedPayments += payment.amount;
            }
          });
        });
      });
      this.amountOfPayToYou = totalCompletedPayments - totalExpenses;
      this.calculateAmountEachMemberShouldPay();
    });
  }

  calculateAmountEachMemberShouldPay() {

    this.groupService.getAllMembersByIdGroup(this.group.id).subscribe((group: any) => {


      const numberOfMembers = group.length;

      if (numberOfMembers > 0) {
        this.totalOfMembers = numberOfMembers;
        this.amountEachMemberShouldPay = this.totalExpenses / numberOfMembers;
      }
      this.getAllGroupMembers();
      this.updatePieChart();
    });
  }

  togglePaidMember(memberId: number) {
    if (this.paidMembers.has(memberId)) {
      this.paidMembers.delete(memberId);
    } else {
      this.paidMembers.add(memberId);
    }
    this.updatePieChart();
  }

  isMemberPaid(memberId: number): boolean {
    return this.paidMembers.has(memberId);
  }

  updatePieChart() {
    const numberOfPaidMembers = this.paidMembers.size;
    const numberOfUnpaidMembers = this.totalOfMembers - numberOfPaidMembers;

    if (this.pieChart) {
      this.pieChart.destroy();
    }

    const canvas = document.getElementById('pieChart') as HTMLCanvasElement;
    this.pieChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Pendiente', 'Pagado'],
        datasets: [{
          data: [numberOfUnpaidMembers, numberOfPaidMembers],
          backgroundColor: ['#C682FFE4', '#36A2EB'],
          hoverBackgroundColor: ['#C682FFE4', '#36A2EB']
        }]
      },
      options: {}
    });
  }

<<<<<<< HEAD
  goToDetailedDistribution(groupId: string) {
    this.router.navigate(['/page-group-expenses-details', groupId]);
  }
=======

>>>>>>> 3a5a5b618a9ae2e6b2b3b3371de3a3f713cef1a4

}
