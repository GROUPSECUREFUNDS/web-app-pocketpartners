import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageGroupExpensesDetailsComponent } from './page-group-expenses-details.component';

describe('PageGroupExpensesDetailsComponent', () => {
  let component: PageGroupExpensesDetailsComponent;
  let fixture: ComponentFixture<PageGroupExpensesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageGroupExpensesDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageGroupExpensesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
