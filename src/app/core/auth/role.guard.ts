import { CanActivateFn } from '@angular/router';
import { createAuthGuard, AuthGuardData } from 'keycloak-angular';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppRole } from './auth.service';

export function hasRequiredAccess(grantedRoles: string[], requiredRoles: AppRole[]): boolean {
  return grantedRoles.includes('ADMIN') || requiredRoles.some(role => grantedRoles.includes(role));
}

export function roleGuard(...requiredRoles: AppRole[]): CanActivateFn {
  return createAuthGuard<CanActivateFn>(async (_route, _state, authData: AuthGuardData) => {
    const router = inject(Router);
    const { authenticated, grantedRoles } = authData;

    if (!authenticated) {
      return false; // provideKeycloak com onLoad:'login-required' redireciona automaticamente
    }

    if (!hasRequiredAccess(grantedRoles.realmRoles, requiredRoles)) {
      return router.parseUrl('/forbidden');
    }

    return true;
  });
}
