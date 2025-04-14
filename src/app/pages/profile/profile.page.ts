import { AuthService } from './../../shared/services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user.model';
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
import { generateSearchKeywords } from '../../shared/functions/generate-search-keywords.function';
import { HotToastService } from '@ngxpert/hot-toast';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
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
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss',
})
export class ProfilePage implements OnInit, OnDestroy {
  isEditing = false;
  user: User | null = null;
  subscription: Subscription | null = null;

  profileForm = new FormGroup({
    id: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', Validators.required),
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ]+([ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/),
    ]),
    residence: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ]+[.,]?(([ '-])[A-Za-zÀ-ÖØ-öø-ÿ0-9]+\.?)*$/),
    ]),
  });

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toast: HotToastService,
    private router: Router
  ) {}

  get isFormValid(): boolean {
    return this.profileForm.valid;
  }

  ngOnInit(): void {
    this.profileForm.disable();
    const userId = this.authService.getUserUid();

    if (!userId) {
      this.router.navigateByUrl('/login');
    } else {
      this.userService.getUserById(userId).then(user => {
        if (user) {
          this.user = user;
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
      id: this.user!.id,
      email: this.user!.email,
      username: this.user!.username,
      name: this.user!.name,
      residence: this.user!.residence,
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.profileForm.enable();
      this.profileForm.get('id')!.disable();
      this.profileForm.get('email')!.disable();
    } else {
      this.patchValues();
      this.profileForm.disable();
    }
  }

  save(): void {
    this.user!.username = this.profileForm.get('username')!.value!;
    this.user!.name = this.profileForm.get('name')!.value!;
    this.user!.residence = this.profileForm.get('residence')!.value!;
    this.user!.usernameSearchKeywords = generateSearchKeywords(
      this.profileForm.get('username')!.value!
    );

    this.subscription = this.userService
      .updateUser$(this.user!.id, this.user!)
      .pipe(
        this.toast.observe({
          loading: 'Updating user...',
          success: 'User updated successfully!',
          error: 'Could not update user. Please try again later.',
        })
      )
      .subscribe(() => {
        this.toggleEdit();
      });
  }

  // TODO: implement account deletion
  // delete(): void {}

  goBack(): void {
    this.router.navigateByUrl('/home');
  }
}
