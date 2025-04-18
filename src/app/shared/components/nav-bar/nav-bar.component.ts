import { HotToastService } from '@ngxpert/hot-toast';
import { Component, OnInit } from '@angular/core';
import { NavItem } from './../../interfaces/nav-item.interface';
import { AuthService } from './../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../services/role.service';
import { ContactService } from '../../services/contact.service';
import { UserRole } from '../../enums/user-role.enum';
import { Contact } from '../../models/contact.model';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  navList: NavItem[] = [];
  role: UserRole | null = null;
  contact: Contact | null = null;
  user: User | null = null;

  constructor(
    private router: Router,
    private toast: HotToastService,
    private authService: AuthService,
    private roleService: RoleService,
    private contactService: ContactService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initData();
  }

  async initData(): Promise<void> {
    const uid = this.authService.getUserUid();

    if (uid) {
      this.role = (await this.roleService.getRole(uid)).role;
    }

    if (this.role === UserRole.Contact) {
      this.contact = await this.contactService.getContactById(uid!);
    } else if (this.role === UserRole.User) {
      this.user = await this.userService.getUserById(uid!);
    }

    this.buildNavList();
  }

  buildNavList(): void {
    this.navList = [
      {
        label: 'Home',
        route: 'home',
        icon: 'home',
      },
      {
        label: 'Jobs',
        route: 'jobs',
        icon: 'cases',
        hidden: this.role !== UserRole.User,
      },
      {
        label: 'My Company',
        route: 'company/' + this.contact?.companyId + '/overview',
        icon: 'apartment',
        hidden: this.role !== UserRole.Contact,
      },
      {
        label: 'Applications',
        route: 'applications/' + this.contact?.companyId,
        icon: 'checklist',
        hidden: this.role !== UserRole.Contact,
      },
      {
        label: 'New Contact',
        route: 'contact-registration',
        icon: 'person_add',
        hidden: this.role !== UserRole.Contact,
      },
    ];
  }

  viewProfile(): void {
    this.router.navigateByUrl('/profile');
  }

  logout(): void {
    const loadingToast = this.toast.loading('Logging out...');
    this.authService.logout().then(() => {
      loadingToast.close();
      this.router.navigateByUrl('/login');
      this.toast.success('Logged out successfully!');
    });
  }
}
