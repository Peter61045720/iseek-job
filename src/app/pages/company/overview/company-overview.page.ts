import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ContactService } from '../../../shared/services/contact.service';
import { CompanyService } from '../../../shared/services/company.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Company } from '../../../shared/models/company.model';

@Component({
  selector: 'app-company-overview',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatListModule,
  ],
  templateUrl: './company-overview.page.html',
  styleUrl: './company-overview.page.scss',
})
export class CompanyOverviewPage implements OnInit {
  company!: Company;
  uid: string;

  constructor(
    private authService: AuthService,
    private contactService: ContactService,
    private companyService: CompanyService
  ) {
    this.uid = this.authService.getUserUid()!;
  }

  ngOnInit(): void {
    this.contactService.getContactById(this.uid).then(contact => {
      this.companyService.getCompanyById(contact!.companyId!).then(company => {
        this.company = company!;
      });
    });
  }
}
