import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { HomeComponent } from './home.component';
import { AuthService } from '../../core/auth/auth.service';
import { SystemStatusService } from '../../core/system-status/system-status.service';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;

  const hasUserRole = signal(false);
  const hasFinanceRole = signal(false);
  const hasDashboardRole = signal(false);
  const profile = signal<any>(null);

  const keycloakStatus = signal<'online' | 'offline' | 'checking'>('checking');
  const userApiStatus = signal<'online' | 'offline' | 'checking'>('checking');
  const financeApiStatus = signal<'online' | 'offline' | 'checking'>('checking');

  const authServiceMock = {
    hasUserRole,
    hasFinanceRole,
    hasDashboardRole,
    profile,
  };

  const systemStatusMock = {
    keycloakStatus,
    userApiStatus,
    financeApiStatus,
  };

  beforeEach(async () => {
    hasUserRole.set(false);
    hasFinanceRole.set(false);
    hasDashboardRole.set(false);
    profile.set(null);
    keycloakStatus.set('checking');
    userApiStatus.set('checking');
    financeApiStatus.set('checking');

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: SystemStatusService, useValue: systemStatusMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
  });

  it('shouldDisplayUsernameInWelcomeMessage', () => {
    profile.set({ firstName: 'Daniel', lastName: 'Alves' });
    fixture.detectChanges();

    const title: HTMLElement = fixture.nativeElement.querySelector('.home-welcome-title');
    expect(title.textContent).toContain('Daniel');
  });

  it('shouldShowDashboardCardWhenHasDashboardRole', () => {
    hasDashboardRole.set(true);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.home-card');
    const titles = Array.from(cards).map((c: any) => c.textContent ?? '');
    expect(titles.some((t) => t.includes('Dashboard'))).toBeTrue();
  });

  it('shouldHideDashboardCardWhenHasNoDashboardRole', () => {
    hasDashboardRole.set(false);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.home-card');
    const titles = Array.from(cards).map((c: any) => c.textContent ?? '');
    expect(titles.some((t) => t.includes('Dashboard'))).toBeFalse();
  });

  it('shouldDisplaySystemStatusFromService', () => {
    keycloakStatus.set('online');
    financeApiStatus.set('offline');
    fixture.detectChanges();

    const statusLabels = fixture.nativeElement.querySelectorAll('.status-label');
    const texts = Array.from(statusLabels).map((el: any) => el.textContent?.trim().toLowerCase() ?? '');
    expect(texts.some((t) => t.includes('online'))).toBeTrue();
    expect(texts.some((t) => t.includes('offline'))).toBeTrue();
  });

  it('shouldShowRecentActivities', () => {
    const items = fixture.nativeElement.querySelectorAll('.activity-item');
    expect(items.length).toBe(3);
  });
});
