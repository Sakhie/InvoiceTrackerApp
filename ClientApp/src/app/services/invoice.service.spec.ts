import { TestBed } from '@angular/core/testing';

import { InvoiceService } from '../services/invoice.service';

describe('Invoice', () => {
  let service: InvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
