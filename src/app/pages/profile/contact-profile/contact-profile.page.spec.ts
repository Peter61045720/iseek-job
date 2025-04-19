import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactProfilePage } from './contact-profile.page';

describe('ContactProfilePage', () => {
  let component: ContactProfilePage;
  let fixture: ComponentFixture<ContactProfilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactProfilePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
