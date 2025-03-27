import { AuthService } from './../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { Observable, of } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatButtonModule, MatCard, MatCardHeader, MatCardTitle, MatCardContent],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss',
})
export class ProfilePage implements OnInit {
  user$: Observable<User | null> = of(null);
  userId: string | null = null;

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

  goBack() {
    const previousUrl = history.state.from || '/';
    this.router.navigateByUrl(previousUrl);
  }
}
