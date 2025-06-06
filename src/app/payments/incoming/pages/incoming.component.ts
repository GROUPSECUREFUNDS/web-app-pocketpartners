import { Component, OnInit } from '@angular/core';
import { GroupEntity } from '../../../group/model/group.entity';
import { PaymentEntity } from "../../model/payment-entity";
import { ContactEntity } from "../../../contacts/model/contact.entity";
import { PaymentService } from "../../services/payment.service";
import { ContactService } from "../../../contacts/services/contact.service";
import { OperationEntity } from "../../../group/model/operation-entity";
import { GroupOperationsService } from '../../../group/services/group-operations.service';
import { GroupService } from '../../../group/services/group.service';
import {AuthenticationService} from "../../../iam/services/authentication.service";
import {PaymentCardMode} from "../../model/payment-card-mode";


@Component({
  selector: 'app-pages',
  templateUrl: './incoming.component.html',
  styleUrls: ['./incoming.component.css']
})
export class IncomingComponent implements OnInit {
  public payments: PaymentEntity[] = [];
  public dataLoaded: Promise<boolean> = new Promise((resolve) => resolve(false));

  constructor(
    private paymentService: PaymentService,
    private authService: AuthenticationService
  ) {
  }
  ngOnInit() {
    this.authService.currUserInformation.subscribe({
      next:(userInfo)=>{
        this.paymentService.getIncomingPaymentsByUserInformationId(userInfo.userId).subscribe({
          next: (payments) => {
            this.payments = payments;
            console.log('Incoming Payments:', this.payments);
          },
          error: (error) => {
            console.error('Error fetching incoming payments:', error);
            this.dataLoaded = Promise.resolve(true);
          },
          complete: () => {
            this.dataLoaded = Promise.resolve(true);
          }
        })
      }
    })
  }

  protected readonly PaymentCardMode = PaymentCardMode;
}
