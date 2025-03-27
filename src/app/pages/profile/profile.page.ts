import { AuthService } from './../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { Observable, of } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatIcon,
  ],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss',
})
export class ProfilePage implements OnInit {
  user$: Observable<User | null> = of(null);
  userId: string | null = null;
  editingField: string | null = null;
  editedValue = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.user$ = this.userService.getUserData(userId);
    console.log(userId);
    this.userId = userId;
  }

  startEditing(field: string, value: string) {
    this.editingField = field;
    this.editedValue = value;
  }

  async saveChanges(field: string) {
    if (this.userId && this.editedValue.trim() !== '') {
      const updatedData: Partial<User> = {
        [field]: this.editedValue,
      };

      try {
        await this.userService.updateUser(this.userId, updatedData);
        this.user$ = this.userService.getUserData(this.userId);
        this.editingField = null;
      } catch (error) {
        console.error('Error updating Firestore:', error);
      }
    } else {
      console.warn('Invalid data to update');
    }
  }

  goBack() {
    const previousUrl = history.state.from || '/';
    this.router.navigateByUrl(previousUrl);
  }
}
