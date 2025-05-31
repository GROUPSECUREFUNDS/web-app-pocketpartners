export class PaymentEntity {

  id: number;
  description: string;
  amount: number;
  status: number;
  userId: number;
  expenseId: number;

  constructor(id: number = 0, description: string = '', amount: number = 0, status: number = 0, userId: number = 0, expenseId: number = 0){
    this.id = id;
    this.description = description;
    this.amount = amount;
    this.status = status;
    this.userId = userId;
    this.expenseId = expenseId;
  }

}
