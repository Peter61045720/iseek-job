import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';
import { AuthService } from '../../../shared/services/auth.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { Contact } from '../../../shared/models/contact.model';
import { UserRole } from '../../../shared/enums/user-role.enum';
import { Company } from '../../../shared/models/company.model';
import { CompanyService } from '../../../shared/services/company.service';
import { ContactService } from '../../../shared/services/contact.service';
import { Role } from '../../../shared/models/role.model';
import { RoleService } from '../../../shared/services/role.service';
import { generateSearchKeywords } from '../../../shared/functions/generate-search-keywords.function';

@Component({
  selector: 'app-company-registration',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatError,
    MatCard,
    MatCardHeader,
    MatCardActions,
    MatCardTitle,
    MatCardContent,
  ],
  templateUrl: './company-registration.page.html',
  styleUrl: './company-registration.page.scss',
})
export class CompanyRegistrationPage {
  contactForm = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^[A-Za-zÀ-ÖØ-öø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+([ '-.][A-Za-zÀ-ÖØ-öø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)*$/
        ),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^\+?\d+$/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    },
    passwordMatchValidator('password', 'confirmPassword')
  );

  companyForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^[A-Za-zÀ-ÖØ-öø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+([ '.-]?[A-Za-zÀ-ÖØ-öø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)*\.?$/
      ),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\+?\d+$/)]),
    location: new FormControl('', [Validators.required]),
    taxNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d+(?:-\d+)*$/)]),
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private roleService: RoleService,
    private companyService: CompanyService,
    private contactService: ContactService,
    private toast: HotToastService
  ) {}

  get areFormsValid(): boolean {
    return this.contactForm.valid && this.companyForm.valid;
  }

  register(): void {
    this.authService
      .register(this.contactForm.get('email')!.value!, this.contactForm.get('password')!.value!)
      .then(userCred => {
        const partialCompany: Partial<Company> = {
          name: this.companyForm.get('name')!.value!,
          email: this.companyForm.get('email')!.value!,
          phone: this.companyForm.get('phone')!.value!,
          location: this.companyForm.get('location')!.value!,
          taxNumber: this.companyForm.get('taxNumber')!.value!,
        };

        this.companyService.createCompany(partialCompany).then(async company => {
          const uid = userCred.user.uid;

          const contact: Contact = {
            id: uid,
            name: this.contactForm.get('name')!.value!,
            email: this.contactForm.get('email')!.value!,
            emailSearchKeywords: generateSearchKeywords(this.contactForm.get('email')!.value!),
            phone: this.contactForm.get('phone')!.value!,
            companyId: company.id,
          };

          const role: Role = {
            id: uid,
            role: UserRole.Contact,
          };

          await this.contactService.createContact(contact);
          await this.roleService.createRole(role);

          this.router.navigateByUrl('/home');
        });
      });
  }
}
