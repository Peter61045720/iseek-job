import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyOverviewPage } from './company-overview.page';

describe('CompanyOverviewPage', () => {
  let component: CompanyOverviewPage;
  let fixture: ComponentFixture<CompanyOverviewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyOverviewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
