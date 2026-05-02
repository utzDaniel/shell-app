import { EnvironmentProviders } from '@angular/core';
import { provideKeycloak as keycloakProvide } from 'keycloak-angular';
import { environment } from '../../../environments/environment';

export function provideKeycloak(): EnvironmentProviders {
  return keycloakProvide({
    config: {
      url: environment.keycloak.url,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId,
    },
    initOptions: {
      onLoad: 'login-required',
      checkLoginIframe: false,
      pkceMethod: 'S256',
    },
  });
}
