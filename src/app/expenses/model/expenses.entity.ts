export class ExpensesEntity {
  id: number
  name: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  groupId: number;
  dueDate: Date;
  remainder?: number;
  status?: string;
  constructor(id: number = 0,name: string = '', amount: number = 0, createdAt: Date = new Date(), updatedAt: Date = new Date(), userId: number = 0, groupId: number = 0, dueDate: Date = new Date()) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.userId = userId;
    this.groupId = groupId;
    this.dueDate = dueDate;
  }
  set_status(status: string){
    this.status=status;
  }
  set_reminder(remainder: number){
    this.remainder=remainder;
  }
}
