export interface OcrReceiptEntity {
  receiptNumber: string;
  imagePath: string;
  name: string;
  issueDate: Date;
  amount: number;
  dataFields: any;
  text: string;

}
