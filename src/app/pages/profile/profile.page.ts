import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss',
})
export class ProfilePage {
  constructor(private router: Router) {}

  goBack() {
    const previousUrl = history.state.from || '/';
    this.router.navigateByUrl(previousUrl);
  }
}
