import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CardModule, ButtonModule],
  template: `
    <div class="home-container">
      <h1 class="home-title">Bem-vindo, {{ username() }}!</h1>
      <p class="home-subtitle">Selecione um módulo para começar.</p>

      <div class="home-cards">
        @if (authService.hasUserRole()) {
          <p-card header="Usuários" subheader="Gerenciamento de usuários" styleClass="home-card">
            <ng-template pTemplate="footer">
              <p-button label="Acessar" icon="pi pi-users" routerLink="/users" />
            </ng-template>
          </p-card>
        }

        @if (authService.hasFinanceRole()) {
          <p-card header="Finanças" subheader="Gestão financeira" styleClass="home-card">
            <ng-template pTemplate="footer">
              <p-button label="Acessar" icon="pi pi-wallet" routerLink="/finance" />
            </ng-template>
          </p-card>
        }

        @if (authService.hasDashboardRole()) {
          <p-card header="Dashboard" subheader="Visão analítica" styleClass="home-card">
            <ng-template pTemplate="footer">
              <p-button label="Acessar" icon="pi pi-chart-bar" routerLink="/dashboard" />
            </ng-template>
          </p-card>
        }

        @if (!authService.hasUserRole() && !authService.hasFinanceRole() && !authService.hasDashboardRole()) {
          <p class="home-no-access">Você não possui acesso a nenhum módulo. Contate o administrador.</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 960px;
      margin: 2rem auto;
    }
    .home-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .home-subtitle {
      color: var(--p-text-muted-color);
      margin-bottom: 2rem;
    }
    .home-cards {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .home-no-access {
      color: var(--p-text-muted-color);
      font-style: italic;
    }
  `],
})
export class HomeComponent {
  protected readonly authService = inject(AuthService);

  readonly username = computed(() => this.authService.profile()?.firstName ?? 'Usuário');
}
