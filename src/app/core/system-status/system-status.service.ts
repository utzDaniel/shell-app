import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export type ServiceStatus = 'online' | 'offline' | 'checking';

@Injectable({ providedIn: 'root' })
export class SystemStatusService {
  private readonly http = inject(HttpClient);

  readonly keycloakStatus = signal<ServiceStatus>('checking');
  readonly userApiStatus = signal<ServiceStatus>('checking');
  readonly financeApiStatus = signal<ServiceStatus>('checking');

  constructor() {
    this.checkAll();
  }

  checkAll(): void {
    this.keycloakStatus.set('checking');
    this.userApiStatus.set('checking');
    this.financeApiStatus.set('checking');

    this.http
      .get(environment.healthChecks.keycloak)
      .pipe(catchError(() => of(null)))
      .subscribe((res) => this.keycloakStatus.set(res !== null ? 'online' : 'offline'));

    this.http
      .get(environment.healthChecks.userApi)
      .pipe(catchError(() => of(null)))
      .subscribe((res) => this.userApiStatus.set(res !== null ? 'online' : 'offline'));

    this.http
      .get(environment.healthChecks.financeApi)
      .pipe(catchError(() => of(null)))
      .subscribe((res) => this.financeApiStatus.set(res !== null ? 'online' : 'offline'));
  }
}
