import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { SystemStatusService } from '../../core/system-status/system-status.service';

export interface RecentActivity {
  id: number;
  title: string;
  category: string;
  date: Date;
  icon: string;
  iconBg: string;
  iconColor: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DatePipe, TitleCasePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  protected readonly authService = inject(AuthService);
  protected readonly systemStatus = inject(SystemStatusService);

  readonly firstName = computed(() => this.authService.profile()?.firstName ?? 'Usuário');

  readonly recentActivities = signal<RecentActivity[]>([
    {
      id: 1,
      title: 'Lançamento de despesa',
      category: 'Financeiro',
      date: new Date('2025-05-16T14:22:00'),
      icon: 'pi-dollar',
      iconBg: '#dcfce7',
      iconColor: '#16a34a',
    },
    {
      id: 2,
      title: 'Relatório gerado',
      category: 'Dashboard',
      date: new Date('2025-05-16T14:15:00'),
      icon: 'pi-chart-bar',
      iconBg: '#dbeafe',
      iconColor: '#2563eb',
    },
    {
      id: 3,
      title: 'Perfil atualizado',
      category: 'Perfil',
      date: new Date('2025-05-16T13:58:00'),
      icon: 'pi-user',
      iconBg: '#ede9fe',
      iconColor: '#7c3aed',
    },
  ]);
}
