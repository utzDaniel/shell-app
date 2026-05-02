import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [RouterLink, ButtonModule],
  template: `
    <div class="forbidden-container">
      <div class="forbidden-content">
        <i class="pi pi-lock forbidden-icon"></i>
        <h1>Acesso Negado</h1>
        <p>Você não tem permissão para acessar este recurso.</p>
        <div class="forbidden-actions">
          <p-button label="Voltar ao Início" icon="pi pi-home" routerLink="/home" />
          <p-button
            label="Sair"
            icon="pi pi-sign-out"
            severity="secondary"
            [outlined]="true"
            (onClick)="logout()"
          />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .forbidden-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: var(--p-surface-ground);
    }
    .forbidden-content {
      text-align: center;
      padding: 3rem;
    }
    .forbidden-icon {
      font-size: 4rem;
      color: var(--p-red-500);
      display: block;
      margin-bottom: 1rem;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    p {
      color: var(--p-text-muted-color);
      margin-bottom: 2rem;
    }
    .forbidden-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
  `],
})
export class ForbiddenComponent {
  private readonly authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
