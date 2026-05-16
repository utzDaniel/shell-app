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
    expect(service.userApiStatus()).toBe('checking');
    expect(service.financeApiStatus()).toBe('checking');
    // Flush para limpar
    httpMock.match(() => true).forEach((req) => req.flush({}));
  });

  it('shouldSetStatusToOnlineWhenHealthCheckReturns200', () => {
    setup();
    service.checkAll();

    const keycloakReq = httpMock.expectOne(environment.healthChecks.keycloak);
    keycloakReq.flush({ status: 'UP' });

    const userApiReq = httpMock.expectOne(environment.healthChecks.userApi);
    userApiReq.flush({ status: 'UP' });

    const financeApiReq = httpMock.expectOne(environment.healthChecks.financeApi);
    financeApiReq.flush({ status: 'UP' });

    expect(service.keycloakStatus()).toBe('online');
    expect(service.userApiStatus()).toBe('online');
    expect(service.financeApiStatus()).toBe('online');
  });

  it('shouldSetStatusToOfflineWhenHealthCheckFails', () => {
    setup();
    service.checkAll();

    const keycloakReq = httpMock.expectOne(environment.healthChecks.keycloak);
    keycloakReq.error(new ProgressEvent('error'));

    const userApiReq = httpMock.expectOne(environment.healthChecks.userApi);
    userApiReq.error(new ProgressEvent('error'));

    const financeApiReq = httpMock.expectOne(environment.healthChecks.financeApi);
    financeApiReq.error(new ProgressEvent('error'));

    expect(service.keycloakStatus()).toBe('offline');
    expect(service.userApiStatus()).toBe('offline');
    expect(service.financeApiStatus()).toBe('offline');
  });
});
