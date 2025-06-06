import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';
import { AuthService } from '../../../shared/services/auth.service';
import { ContactService } from '../../../shared/services/contact.service';
import { Contact } from '../../../shared/models/contact.model';
import { UserRole } from '../../../shared/enums/user-role.enum';
import { Role } from '../../../shared/models/role.model';
import { RoleService } from '../../../shared/services/role.service';
import { generateSearchKeywords } from '../../../shared/functions/generate-search-keywords.function';

@Component({
  selector: 'app-contact-registration',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatError,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
  ],
  templateUrl: './contact-registration.page.html',
  styleUrl: './contact-registration.page.scss',
})
export class ContactRegistrationPage implements OnInit {
  contactForm = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^[A-Za-zÀ-ÖØ-öø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+([ '-][A-Za-zÀ-ÖØ-öø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)*$/
        ),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^\+?\d+$/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    },
    passwordMatchValidator('password', 'confirmPassword')
  );
  contactId: string;
  companyId!: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private roleService: RoleService,
    private contactService: ContactService
  ) {
    this.contactId = this.authService.getUserUid()!;
  }

  ngOnInit(): void {
    this.contactService.getContactById(this.contactId).then(contact => {
      this.companyId = contact!.companyId;
    });
  }

  get isFormValid(): boolean {
    return this.contactForm.valid;
  }

  register(): void {
    this.authService
      .register(this.contactForm.get('email')!.value!, this.contactForm.get('password')!.value!)
      .then(async userCred => {
        const uid = userCred.user.uid;

        const contact: Contact = {
          id: uid,
          name: this.contactForm.get('name')!.value!,
          email: this.contactForm.get('email')!.value!,
          emailSearchKeywords: generateSearchKeywords(this.contactForm.get('email')!.value!),
          phone: this.contactForm.get('phone')!.value!,
          companyId: this.companyId,
        };

        const role: Role = {
          id: uid,
          role: UserRole.Contact,
        };

        await this.contactService.createContact(contact);
        await this.roleService.createRole(role);

        this.router.navigateByUrl('/home');
      });
  }
}
