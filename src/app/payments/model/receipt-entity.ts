export class ReceiptEntity {
  id: number;
  name: string;
  amount: number;
  receiptNumber: string;
  issueDate: Date;
  imagePath: string;

  constructor(id: number, name: string, amount: number, issueDate: Date, imagePath: string, receiptNumber: string) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.issueDate = issueDate;
    this.imagePath = imagePath;
    this.receiptNumber= receiptNumber;
  }

}
