import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [RouterOutlet, MenubarModule, ButtonModule, AvatarModule],
  template: `
    <div class="shell-container">
      <p-menubar [model]="menuItems()" styleClass="shell-menubar">
        <ng-template pTemplate="start">
          <span class="shell-brand">MyApp</span>
        </ng-template>
        <ng-template pTemplate="end">
          <div class="shell-user-area">
            <p-avatar
              [label]="userInitial()"
              shape="circle"
              styleClass="mr-2"
            />
            <span class="shell-username">{{ username() }}</span>
            <p-button
              label="Sair"
              icon="pi pi-sign-out"
              severity="secondary"
              [text]="true"
              (onClick)="logout()"
            />
          </div>
        </ng-template>
      </p-menubar>

      <main class="shell-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .shell-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .shell-brand {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--p-primary-color);
      margin-right: 1rem;
    }
    .shell-user-area {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .shell-username {
      font-weight: 500;
    }
    .shell-content {
      flex: 1;
      padding: 1.5rem;
    }
  `],
})
export class ShellLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly menuItems = computed<MenuItem[]>(() => {
    const items: MenuItem[] = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/home',
      },
    ];

    if (this.authService.hasUserRole()) {
      items.push({ label: 'Usuários', icon: 'pi pi-users', routerLink: '/users' });
    }

    if (this.authService.hasFinanceRole()) {
      items.push({ label: 'Finanças', icon: 'pi pi-wallet', routerLink: '/finance' });
    }

    if (this.authService.hasDashboardRole()) {
      items.push({ label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: '/dashboard' });
    }

    return items;
  });

  readonly username = computed(() => this.authService.profile()?.username ?? 'Usuário');

  readonly userInitial = computed(() => {
    const name = this.authService.profile()?.firstName ?? this.username();
    return name.charAt(0).toUpperCase();
  });

  logout(): void {
    this.authService.logout();
  }
}
