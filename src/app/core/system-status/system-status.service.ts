import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export type ServiceStatus = 'online' | 'offline' | 'checking';

@Injectable({ providedIn: 'root' })
export class SystemStatusService {
  private readonly http = inject(HttpClient);

  readonly keycloakStatus = signal<ServiceStatus>('checking');
  readonly gatewayStatus = signal<ServiceStatus>('checking');
  readonly servicesStatus = signal<ServiceStatus>('checking');

  constructor() {
    this.checkAll();
  }

  checkAll(): void {
    this.keycloakStatus.set('checking');
    this.gatewayStatus.set('checking');
    this.servicesStatus.set('checking');

    this.http
      .get(environment.healthChecks.keycloak)
      .pipe(catchError(() => of(null)))
      .subscribe((res) => this.keycloakStatus.set(res !== null ? 'online' : 'offline'));

    this.http
      .get(environment.healthChecks.gateway)
      .pipe(catchError(() => of(null)))
      .subscribe((res) => this.gatewayStatus.set(res !== null ? 'online' : 'offline'));

    this.http
      .get(environment.healthChecks.services)
      .pipe(catchError(() => of(null)))
      .subscribe((res) => this.servicesStatus.set(res !== null ? 'online' : 'offline'));
  }
}
