import { TestBed } from '@angular/core/testing';

import { OcrReceiptService } from './ocr-receipt.service';

describe('OcrReceiptService', () => {
  let service: OcrReceiptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OcrReceiptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
