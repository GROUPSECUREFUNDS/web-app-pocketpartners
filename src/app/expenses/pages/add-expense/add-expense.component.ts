import { Component, OnInit } from '@angular/core';
import { PartnerService } from "../../../pockets/services/Partner.service";
import { ExpensesService } from "../../services/expenses.service";
import { AuthenticationService } from "../../../iam/services/authentication.service";
import { GroupService } from "../../../group/services/group.service";
import { GroupOperationsService } from "../../../group/services/group-operations.service";
import { PartnerEntity } from "../../../pockets/model/partnerEntity";
import { ExpensesEntity } from "../../model/expenses.entity";
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.css'
})
export class AddExpenseComponent implements OnInit {
  userId: number = 0;
  joinedGroups: any = [];

  constructor(
    private partnerService: PartnerService,
    private expenseService: ExpensesService,
    private authenticationService: AuthenticationService,
    private groupService: GroupService,
    private router: Router 
  ) { }

  user: PartnerEntity = new PartnerEntity();

  ngOnInit(): void {
    this.authenticationService.currentUserId.subscribe((userId: any) => {
      this.userId = userId;
      this.partnerService.getPartnerById(userId).subscribe((partner: any) => {
        this.expenseService.getJoinedUserGroups(userId).subscribe((groups: any) => {
          groups.forEach((group: any) => {
            this.groupService.getById(group.groupId).subscribe((group: any) => {
              this.joinedGroups.push(group);
            });
          });
        });
      });
    });
  }

  onSubmit(expense: ExpensesEntity) {
    let expenseClean: any = { ...expense };
    expenseClean.userId = this.userId;
    delete expenseClean.createdAt;
    delete expenseClean.updatedAt;
    this.expenseService.create(expenseClean).subscribe(() => {
      this.redirectToExpensesList(); 
    });
  }

  redirectToExpensesList() {
    this.router.navigate(['/expenses']); 
  }
}
