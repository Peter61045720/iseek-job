import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactRegistrationPage } from './contact-registration.page';

describe('ContactRegistrationPage', () => {
  let component: ContactRegistrationPage;
  let fixture: ComponentFixture<ContactRegistrationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactRegistrationPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactRegistrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
