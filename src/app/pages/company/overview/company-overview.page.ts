import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ContactService } from '../../../shared/services/contact.service';
import { CompanyService } from '../../../shared/services/company.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Company } from '../../../shared/models/company.model';
import { Router } from '@angular/router';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';

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
    MatFormField,
    MatLabel,
    MatIcon,
    MatInputModule,
    MatInput,
    MatCardContent,
  ],
  templateUrl: './company-overview.page.html',
  styleUrl: './company-overview.page.scss',
})
export class CompanyOverviewPage implements OnInit {
  company!: Company;
  uid: string;
  form!: FormGroup;
  isEditing = false;

  constructor(
    private authService: AuthService,
    private contactService: ContactService,
    private companyService: CompanyService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.uid = this.authService.getUserUid()!;
  }

  ngOnInit(): void {
    this.contactService.getContactById(this.uid).then(contact => {
      const companyId = contact?.companyId;
      if (companyId) {
        this.companyService.getCompanyById(companyId).then(company => {
          this.company = company!;
          this.form = this.fb.group({
            id: [this.company.id],
            name: [
              this.company.name,
              [
                Validators.required,
                Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ]+([ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/),
              ],
            ],
            email: [this.company.email, [Validators.required, Validators.email]],
            phone: [this.company.phone, [Validators.required, Validators.pattern(/^\+?\d{11}$/)]],
            location: [
              this.company.location,
              [
                Validators.required,
                Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ]+([ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/),
              ],
            ],
            taxNumber: [this.company.taxNumber],
          });
          this.form.disable();
        });
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.form.patchValue(this.company);
      this.form.disable();
    } else {
      this.form.enable();
      this.form.get('id')!.disable();
      this.form.get('taxNumber')!.disable();
    }
  }

  async save(): Promise<void> {
    if (this.form.valid) {
      const updatedData = this.form.value;
      await this.companyService.update(this.company.id, updatedData);
      this.company = { ...this.company, ...updatedData };
      this.toggleEdit();
    }
  }

  get isFormValid(): boolean {
    return this.form.valid;
  }

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }
}
