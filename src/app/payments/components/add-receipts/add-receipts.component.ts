import {Component, Inject, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ImageService} from "../../../shared/services/image.service";
import {ReceiptService} from "../../services/receipt.service";
import {PaymentEntity} from "../../model/payment-entity";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {OcrReceiptService} from "../../services/ocr-receipt.service";
import {ExpensesEntity} from "../../../expenses/model/expenses.entity";
import {Observable} from "rxjs";

@Component({
  selector: 'app-add-receipts',
  templateUrl: './add-receipts.component.html',
  styleUrl: './add-receipts.component.css'
})
export class AddReceiptsComponent {
  receiptData: FormGroup;
  previewUrl: string | null = null;
  showFormAddReceipt: boolean = true;
  imageIsLoading: boolean = false;
  ocrIsLoading: boolean = false;
  addReceiptIsLoading: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private imageService: ImageService,
              private receiptService: ReceiptService,
              private ocrReceiptService: OcrReceiptService,
              @Inject(MAT_DIALOG_DATA) public data: {
                payment: PaymentEntity|null,
                expense: ExpensesEntity|null
              },
  ) {
    this.receiptData = this.formBuilder.group({
      name: ['', Validators.required],
      issueDate: [new Date(), Validators.required],
      receiptNumber: ['', Validators.required],
      amount: [0, Validators.required],
      imagePath: [''],
    });
  }

  addReceipt() {
    console.log(
      'Receipt Data:', this.receiptData.value
    )
    if (this.receiptData.valid) {
      const receipt = this.receiptData.value;
      let postReceipt$ = new Observable<any>();

      if(this.data.expense && !this.data.payment) {
        postReceipt$ = this.receiptService.createReceiptByExpense(receipt, this.data.expense.id);
      }else if(this.data.payment && !this.data.expense) {
        postReceipt$ = this.receiptService.createReceiptByPayment(receipt, this.data.payment.id);
      } else {
        console.error('Neither payment nor expense is provided');
        return;
      }
      this.addReceiptIsLoading = true; // Start loading before the operation
      postReceipt$.subscribe({
        next: (response) => {
          console.log('Receipt created successfully:', response);
          this.showFormAddReceipt = false; // Hide form after successful submission
        },
        error: (error) => {
          console.error('Error creating receipt:', error);
          this.addReceiptIsLoading = false; // Stop loading on error
        }
        , complete: () => {
          this.addReceiptIsLoading = false; // Stop loading after the operation completes
        }
      });


    } else {
      console.error('Form is invalid');
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.imageIsLoading = true;
    if (file) {
      this.imageService.postImage(file).subscribe((data) => {
        this.receiptData.patchValue({
          imagePath: data.imageId
        });
        this.previewUrl = this.imageService.getImageUrlById(data.imageId);
        console.log("Image ID:", data.imageId);
      });
    }
    this.imageIsLoading = false;
  }

  removeImage() {
    this.previewUrl = null; // Reset preview URL
  }

  extractFieldsFromReceiptImage() {
    const imagePath = this.receiptData.get('imagePath')?.value;
    if (imagePath) {
      this.ocrIsLoading = true; // Start loading before the operation
      console.log('Extracting fields from receipt image:', imagePath);
      this.ocrReceiptService.getOcrReceiptByImage(imagePath).subscribe({
        next: (ocrReceipt) => {
          this.receiptData.patchValue({
            name: ocrReceipt.name,
            issueDate: new Date(ocrReceipt.issueDate),
            receiptNumber: ocrReceipt.receiptNumber,
            amount: ocrReceipt.amount
          });
          console.log('OCR Receipt Data:', ocrReceipt);
        },
        error: (error) => {
          console.error('Error extracting fields from receipt image:', error);
          this.ocrIsLoading = false; // Stop loading on error
        },
        complete: () => {
          this.ocrIsLoading = false; // Stop loading after the operation completes
        }
      });
    }
  }
}
