import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsTodoPageComponent } from './payments-todo-page.component';

describe('PaymentsTodoPageComponent', () => {
  let component: PaymentsTodoPageComponent;
  let fixture: ComponentFixture<PaymentsTodoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentsTodoPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsTodoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
