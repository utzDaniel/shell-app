export const environment = {
  production: false,
  envName: 'DEV',
  keycloak: {
    url: 'http://localhost:9999',
    realm: 'development',
    clientId: 'shell-app',
  },
  gatewayUrl: 'http://localhost:8090',
  healthChecks: {
    keycloak: 'http://localhost:9999/realms/development',
    gateway: 'http://localhost:8090/actuator/health',
    services: 'http://localhost:8091/actuator/health',
  },
};
