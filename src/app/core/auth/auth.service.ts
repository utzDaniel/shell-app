import { computed, effect, inject, Injectable, Signal, signal } from '@angular/core';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType } from 'keycloak-angular';
import Keycloak, { KeycloakProfile } from 'keycloak-js';

export type AppRole = 'USER' | 'FINANCE' | 'DASHBOARD';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly keycloak = inject(Keycloak);
  private readonly keycloakEvent = inject(KEYCLOAK_EVENT_SIGNAL);

  private readonly _roles = signal<AppRole[]>([]);
  private readonly _profile = signal<KeycloakProfile | null>(null);

  readonly roles: Signal<AppRole[]> = this._roles.asReadonly();
  readonly profile: Signal<KeycloakProfile | null> = this._profile.asReadonly();

  readonly isAuthenticated: Signal<boolean> = computed(() => {
    const event = this.keycloakEvent();
    return event.type === KeycloakEventType.Ready
      ? (event.args as boolean)
      : this.keycloak.authenticated ?? false;
  });

  readonly hasUserRole: Signal<boolean> = computed(() => this._roles().includes('USER'));
  readonly hasFinanceRole: Signal<boolean> = computed(() => this._roles().includes('FINANCE'));
  readonly hasDashboardRole: Signal<boolean> = computed(() => this._roles().includes('DASHBOARD'));

  constructor() {
    // Carrega dados do usuário automaticamente ao autenticar
    effect(() => {
      const event = this.keycloakEvent();
      if (event.type === KeycloakEventType.Ready && event.args === true) {
        this.loadUserData();
      }
    });
  }

  async loadUserData(): Promise<void> {
    if (!this.keycloak.authenticated) return;

    const tokenParsed = this.keycloak.tokenParsed;
    const realmRoles = (tokenParsed?.['realm_access']?.['roles'] ?? []) as AppRole[];
    this._roles.set(realmRoles);

    const profile: KeycloakProfile = {
      id:        tokenParsed?.['sub'],
      username:  tokenParsed?.['preferred_username'],
      firstName: tokenParsed?.['given_name'],
      lastName:  tokenParsed?.['family_name'],
      email:     tokenParsed?.['email'],
    };
    this._profile.set(profile);
  }

  hasRole(role: AppRole): boolean {
    return this.keycloak.hasRealmRole(role);
  }

  getToken(): Promise<string> {
    return this.keycloak.updateToken(30).then(() => this.keycloak.token ?? '');
  }

  logout(): void {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }
}
