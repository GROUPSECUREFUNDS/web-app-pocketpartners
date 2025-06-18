import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesSummaryCardComponent } from './expenses-summary-card.component';

describe('ExpensesSummaryCardComponent', () => {
  let component: ExpensesSummaryCardComponent;
  let fixture: ComponentFixture<ExpensesSummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpensesSummaryCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensesSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
