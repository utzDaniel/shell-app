import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SystemStatusService } from './system-status.service';
import { environment } from '../../../environments/environment';

describe('SystemStatusService', () => {
  let service: SystemStatusService;
  let httpMock: HttpTestingController;

  function setup(flushConstructor = true): void {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SystemStatusService);
    if (flushConstructor) {
      httpMock.match(() => true).forEach((req) => req.flush({}));
    }
  }

  afterEach(() => {
    httpMock?.verify();
    TestBed.resetTestingModule();
  });

  it('shouldInitializeWithCheckingStatus', () => {
    setup(false);
    // Antes do flush das requests do constructor os signals devem ser 'checking'
    expect(service.keycloakStatus()).toBe('checking');
    expect(service.gatewayStatus()).toBe('checking');
    expect(service.servicesStatus()).toBe('checking');
    // Flush para limpar
    httpMock.match(() => true).forEach((req) => req.flush({}));
  });

  it('shouldSetStatusToOnlineWhenHealthCheckReturns200', () => {
    setup();
    service.checkAll();

    const keycloakReq = httpMock.expectOne(environment.healthChecks.keycloak);
    keycloakReq.flush({ status: 'UP' });

    const gatewayReq = httpMock.expectOne(environment.healthChecks.gateway);
    gatewayReq.flush({ status: 'UP' });

    const servicesReq = httpMock.expectOne(environment.healthChecks.services);
    servicesReq.flush({ status: 'UP' });

    expect(service.keycloakStatus()).toBe('online');
    expect(service.gatewayStatus()).toBe('online');
    expect(service.servicesStatus()).toBe('online');
  });

  it('shouldSetStatusToOfflineWhenHealthCheckFails', () => {
    setup();
    service.checkAll();

    const keycloakReq = httpMock.expectOne(environment.healthChecks.keycloak);
    keycloakReq.error(new ProgressEvent('error'));

    const gatewayReq = httpMock.expectOne(environment.healthChecks.gateway);
    gatewayReq.error(new ProgressEvent('error'));

    const servicesReq = httpMock.expectOne(environment.healthChecks.services);
    servicesReq.error(new ProgressEvent('error'));

    expect(service.keycloakStatus()).toBe('offline');
    expect(service.gatewayStatus()).toBe('offline');
    expect(service.servicesStatus()).toBe('offline');
  });
});
