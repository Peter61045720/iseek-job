import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyRegistrationPage } from './company-registration.page';

describe('CompanyRegistrationPage', () => {
  let component: CompanyRegistrationPage;
  let fixture: ComponentFixture<CompanyRegistrationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyRegistrationPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyRegistrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
