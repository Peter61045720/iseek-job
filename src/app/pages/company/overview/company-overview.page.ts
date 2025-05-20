import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ContactService } from '../../../shared/services/contact.service';
import { CompanyService } from '../../../shared/services/company.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Company } from '../../../shared/models/company.model';
import { Router } from '@angular/router';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { CloudinaryModule } from '@cloudinary/ng';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { CloudinaryService } from '../../../shared/services/cloudinary.service';
import { HotToastService } from '@ngxpert/hot-toast';

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
    MatCardActions,
    CloudinaryModule,
  ],
  templateUrl: './company-overview.page.html',
  styleUrl: './company-overview.page.scss',
})
export class CompanyOverviewPage implements OnInit, OnDestroy {
  isEditing = false;
  company: Company | null = null;
  subscriptions: Subscription[] = [];
  logo!: CloudinaryImage;

  companyForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^[A-Za-zÀ-ÖØ-öø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+([ '.-]?[A-Za-zÀ-ÖØ-öø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)*\.?$/
      ),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\+?\d{11}$/)]),
    location: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű0-9\s.,'-]+$/),
    ]),
    taxNumber: new FormControl(''),
  });

  constructor(
    private authService: AuthService,
    private contactService: ContactService,
    private companyService: CompanyService,
    private cloudinaryService: CloudinaryService,
    private toast: HotToastService,
    private router: Router
  ) {}

  get isFormValid(): boolean {
    return this.companyForm.valid;
  }

  ngOnInit(): void {
    this.companyForm.disable();
    const uid = this.authService.getUserUid();

    if (!uid) {
      this.router.navigateByUrl('/login');
    } else {
      this.contactService.getContactById(uid).then(contact => {
        if (contact) {
          const companyId = contact.companyId;
          this.getCompanyData(companyId);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  getCompanyData(id: string): void {
    this.companyService.getCompanyById(id).then(company => {
      if (company) {
        this.company = company;
        this.patchValues();
        this.logo = this.cloudinaryService.getImageById(
          this.company.logoId ? this.company.logoId : CloudinaryService.DEFAULT_COMPANY_IMAGE_ID
        );
      }
    });
  }

  patchValues(): void {
    this.companyForm.patchValue({
      id: this.company!.id,
      name: this.company!.name,
      email: this.company!.email,
      phone: this.company!.phone,
      location: this.company!.location,
      taxNumber: this.company!.taxNumber,
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.companyForm.enable();
      this.companyForm.get('id')!.disable();
      this.companyForm.get('taxNumber')!.disable();
    } else {
      this.patchValues();
      this.companyForm.disable();
    }
  }

  openFileDialog(input: HTMLInputElement): void {
    input.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.subscriptions.push(
        this.cloudinaryService
          .uploadImage(file)
          .pipe(
            this.toast.observe({
              loading: 'Uploading image...',
              success: 'Image uploaded successfully!',
              error: 'Could not upload image. Please try again later',
            })
          )
          .subscribe(response => {
            this.company!.logoId = response.public_id;
            this.save();
          })
      );
    }
  }

  save(): void {
    this.company!.name = this.companyForm.get('name')!.value!;
    this.company!.email = this.companyForm.get('email')!.value!;
    this.company!.phone = this.companyForm.get('phone')!.value!;
    this.company!.location = this.companyForm.get('location')!.value!;

    this.subscriptions.push(
      this.companyService
        .updateCompany$(this.company!.id, this.company!)
        .pipe(
          this.toast.observe({
            loading: 'Updating company...',
            success: 'Company updated successfully!',
            error: 'Could not update company. Please try again later.',
          })
        )
        .subscribe(() => {
          this.toggleEdit();
          this.getCompanyData(this.company!.id);
        })
    );
  }

  deleteLogo(): void {
    this.company!.logoId = CloudinaryService.DEFAULT_COMPANY_IMAGE_ID;
    this.save();
  }

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }
}
