import {Component, Input, OnInit} from '@angular/core';
import {ExpensesEntity} from "../../../expenses/model/expenses.entity";
import { GroupEntity } from '../../model/group.entity';
import {GroupService} from "../../services/group.service";

@Component({
  selector: 'app-expense-summary-card',
  templateUrl: './expenses-summary-card.component.html',
  styleUrl: './expenses-summary-card.component.css'
})
export class ExpensesSummaryCardComponent implements OnInit {
  @Input() expense!: ExpensesEntity;
  @Input() groupMembers: any[] = [];
  group: GroupEntity = new GroupEntity();

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    if (this.expense?.groupId) {
      this.groupService.getById(this.expense.groupId).subscribe((groupData) => {
        this.group = groupData;
      });
    }
  }
  getCreatorName(): string {
    const user = this.groupMembers.find(u => u.userId === this.expense.userId);
    return user ? user.fullName : 'Usuario desconocido';
  }
}
