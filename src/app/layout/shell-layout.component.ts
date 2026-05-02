import { Component, computed, inject, signal, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { AuthService } from '../core/auth/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DatePipe, AvatarModule, BadgeModule],
  templateUrl: './shell-layout.component.html',
  styleUrl: './shell-layout.component.scss',
})
export class ShellLayoutComponent implements OnDestroy {
  readonly authService = inject(AuthService);

  readonly envName = environment.envName;

  readonly sidebarCollapsed = signal(false);

  readonly currentTime = signal(new Date());

  private readonly _timer = setInterval(() => this.currentTime.set(new Date()), 1000);

  readonly fullName = computed(() => {
    const profile = this.authService.profile();
    if (!profile) return 'Usuário';
    const first = profile.firstName ?? '';
    const last = profile.lastName ?? '';
    return `${first} ${last}`.trim() || profile.username || 'Usuário';
  });

  readonly userInitials = computed(() => {
    const profile = this.authService.profile();
    if (!profile) return 'U';
    const first = (profile.firstName ?? '').charAt(0).toUpperCase();
    const last = (profile.lastName ?? '').charAt(0).toUpperCase();
    return first && last ? `${first}${last}` : first || 'U';
  });

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    clearInterval(this._timer);
  }
}
