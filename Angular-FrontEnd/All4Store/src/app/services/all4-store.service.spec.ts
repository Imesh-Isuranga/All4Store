import { TestBed } from '@angular/core/testing';

import { All4StoreService } from './all4-store.service';

describe('All4StoreService', () => {
  let service: All4StoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(All4StoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
