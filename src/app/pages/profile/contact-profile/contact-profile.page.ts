import { AuthService } from './../../../shared/services/auth.service';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { HotToastService } from '@ngxpert/hot-toast';
import { Subscription } from 'rxjs';
import { DeleteAccountDialog } from '../../../shared/components/dialogs/delete-account/delete-account.dialog';
import { MatDialog } from '@angular/material/dialog';
import { Contact } from '../../../shared/models/contact.model';
import { ContactService } from '../../../shared/services/contact.service';

@Component({
  selector: 'app-contact-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatError,
    MatButtonModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatIcon,
  ],
  templateUrl: './contact-profile.page.html',
  styleUrl: './contact-profile.page.scss',
})
export class ContactProfilePage implements OnInit, OnDestroy {
  readonly password = signal('');

  isEditing = false;
  contact: Contact | null = null;
  subscription: Subscription | null = null;

  profileForm = new FormGroup({
    id: new FormControl(''),
    companyId: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ]+([ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/),
    ]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\+?\d+$/)]),
  });

  constructor(
    private readonly dialog: MatDialog,
    private authService: AuthService,
    private contactService: ContactService,
    private toast: HotToastService,
    private router: Router
  ) {}

  get isFormValid(): boolean {
    return this.profileForm.valid;
  }

  ngOnInit(): void {
    this.profileForm.disable();
    const uid = this.authService.getUserUid();

    if (!uid) {
      this.router.navigateByUrl('/login');
    } else {
      this.contactService.getContactById(uid).then(contact => {
        if (contact) {
          this.contact = contact;
          this.patchValues();
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  patchValues(): void {
    this.profileForm.patchValue({
      id: this.contact!.id,
      companyId: this.contact!.companyId,
      email: this.contact!.email,
      name: this.contact!.name,
      phone: this.contact!.phone,
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.profileForm.enable();
      this.profileForm.get('id')!.disable();
      this.profileForm.get('companyId')!.disable();
      this.profileForm.get('email')!.disable();
    } else {
      this.patchValues();
      this.profileForm.disable();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DeleteAccountDialog, {
      data: { password: this.password() },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.password.set(result);
        this.delete();
      }
    });
  }

  save(): void {
    this.contact!.name = this.profileForm.get('name')!.value!;
    this.contact!.phone = this.profileForm.get('phone')!.value!;

    this.subscription = this.contactService
      .updateContact$(this.contact!.id, this.contact!)
      .pipe(
        this.toast.observe({
          loading: 'Updating contact...',
          success: 'Contact updated successfully!',
          error: 'Could not update contact. Please try again later.',
        })
      )
      .subscribe(() => {
        this.toggleEdit();
      });
  }

  async delete(): Promise<void> {
    const loadingToast = this.toast.loading('Deleting account...');

    try {
      const userCred = await this.authService.reauthenticate(this.contact!.email, this.password());
      await this.contactService.deleteContact(userCred.user.uid);
      await this.authService.delete();
      this.toast.success('Account deleted successfully');
      this.router.navigateByUrl('/login');
    } catch {
      this.toast.error('The password you entered is incorrect.');
    } finally {
      loadingToast.close();
    }
  }

  goBack(): void {
    this.router.navigateByUrl('/home');
  }
}
