export const environment = {
  production: false,
  envName: 'DEV',
  keycloak: {
    url: 'http://localhost:9999',
    realm: 'development',
    clientId: 'shell-app',
  },
  backendUrls: [
    'http://localhost:8081',
    'http://localhost:8082'
  ],
  healthChecks: {
    keycloak: 'http://localhost:9999/realms/development',
    userApi: '/proxy/user-api/actuator/health',
    financeApi: '/proxy/finance-api/actuator/health',
  },
};
