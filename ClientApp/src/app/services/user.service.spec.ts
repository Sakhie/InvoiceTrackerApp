import { TestBed } from '@angular/core/testing';
import { UserService } from '../services/users.service';

describe('Customer', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
