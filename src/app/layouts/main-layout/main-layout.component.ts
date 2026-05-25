import { Component, inject, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatListItemIcon, MatListItemTitle, MatNavList } from '@angular/material/list';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { environment } from '../../../environments/environment';
import { UserRoles } from '../../common/constants/user-roles.enum';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { AuthService } from '../../modules/auth/services/auth.service';

interface UserData {
  username: string;
  email: string;
  role: string;
  tenantId: string;
}

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MatIcon,
    MatButton,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatDivider,
    MatNavList,
    MatListItem,
    MatListItemIcon,
    MatListItemTitle,
    LogoComponent,
    ThemeToggleComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly user = signal<UserData | null>(this.#loadUser());

  readonly menuItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Escolas', icon: 'account_balance', route: '/schools' },
    { label: 'Alunos', icon: 'groups', route: '/students' },
    { label: 'Professores', icon: 'school', route: '/teachers' },
    { label: 'Disciplinas', icon: 'menu_book', route: '/subjects' },
    { label: 'Configurações', icon: 'settings', route: '/settings' },
  ];

  getUserRole(): string {
    return UserRoles[this.user()?.role.toUpperCase() as keyof typeof UserRoles] || '';
  }

  logout(): void {
    this.authService.logout();
  }

  #loadUser(): UserData | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(environment.APP_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserData;
    } catch {
      return null;
    }
  }
}
