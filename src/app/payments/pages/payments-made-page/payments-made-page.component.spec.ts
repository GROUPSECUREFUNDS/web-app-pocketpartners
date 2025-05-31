import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsMadePageComponent } from './payments-made-page.component';

describe('PaymentsMadePageComponent', () => {
  let component: PaymentsMadePageComponent;
  let fixture: ComponentFixture<PaymentsMadePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentsMadePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsMadePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
