import { TestBed } from '@angular/core/testing';

import { FirestoreBaseService } from './firestore-base.service';

describe('FirestoreBaseService', () => {
  let service: FirestoreBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
