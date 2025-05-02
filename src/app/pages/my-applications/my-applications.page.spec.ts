import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyApplicationsPage } from './my-applications.page';

describe('MyApplicationsPage', () => {
  let component: MyApplicationsPage;
  let fixture: ComponentFixture<MyApplicationsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyApplicationsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyApplicationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
