import {Component, Inject, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ImageService} from "../../../shared/services/image.service";
import {ReceiptService} from "../../services/receipt.service";
import {PaymentEntity} from "../../model/payment-entity";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-add-receipts',
  templateUrl: './add-receipts.component.html',
  styleUrl: './add-receipts.component.css'
})
export class AddReceiptsComponent {
  receiptData:FormGroup;
  previewUrl: string | null = null;
  showFormAddReceipt:boolean = true;

  constructor(private formBuilder: FormBuilder,
              private imageService:ImageService,
              private receiptService:ReceiptService,
              @Inject(MAT_DIALOG_DATA) public data: { payment: PaymentEntity },
              ) {
    this.receiptData = this.formBuilder.group({
      name: ['',Validators.required],
      issueDate: [new Date(),Validators.required],
      amount: [0,Validators.required],
      imagePath: ['',Validators.required],
    });
  }

  addReceipt() {
    console.log(
      'Receipt Data:', this.receiptData.value
    )
    if (this.receiptData.valid) {
      const receipt = this.receiptData.value;
      const receiptRequest = {...receipt, "paymentId":this.data.payment.id}
      this.receiptService.createReceipt(receiptRequest).subscribe((data)=>{
        this.receiptData.reset();
        this.previewUrl = null; // Reset preview URL after submission
        this.showFormAddReceipt = false; // Hide the form after submission
      });


    } else {
      console.error('Form is invalid');
    }
  }
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imageService.postImage(file).subscribe((data)=>{
        this.receiptData.patchValue({
          imagePath: data.imageId
        });
        this.previewUrl = this.imageService.getImageUrlById(data.imageId);
        console.log("Image ID:", data.imageId);
      });
    }
  }
}
