import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcrReceiptComponent } from './ocr-receipt.component';

describe('OcrReceiptComponent', () => {
  let component: OcrReceiptComponent;
  let fixture: ComponentFixture<OcrReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OcrReceiptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OcrReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
