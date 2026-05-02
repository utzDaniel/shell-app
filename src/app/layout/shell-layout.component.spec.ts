import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ShellLayoutComponent } from './shell-layout.component';
import { AuthService } from '../core/auth/auth.service';

describe('ShellLayoutComponent', () => {
  let fixture: ComponentFixture<ShellLayoutComponent>;
  let component: ShellLayoutComponent;

  const hasUserRole = signal(false);
  const hasFinanceRole = signal(false);
  const hasDashboardRole = signal(false);
  const profile = signal<any>(null);
  const logoutSpy = jasmine.createSpy('logout');

  const authServiceMock = {
    hasUserRole,
    hasFinanceRole,
    hasDashboardRole,
    profile,
    logout: logoutSpy,
  };

  beforeEach(async () => {
    hasUserRole.set(false);
    hasFinanceRole.set(false);
    hasDashboardRole.set(false);
    profile.set(null);
    logoutSpy.calls.reset();

    await TestBed.configureTestingModule({
      imports: [ShellLayoutComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shouldRenderSidebarWithMenuItems', () => {
    const sidebarItems = fixture.nativeElement.querySelectorAll('.sidebar-nav-item');
    const labels = Array.from(sidebarItems).map((el: any) => el.textContent?.trim());
    expect(labels.some((l) => l?.includes('Início'))).toBeTrue();
    expect(labels.some((l) => l?.includes('Sair'))).toBeTrue();
  });

  it('shouldToggleSidebarOnCollapseButtonClick', () => {
    expect(component.sidebarCollapsed()).toBeFalse();

    const btn = fixture.debugElement.query(By.css('.sidebar-collapse-btn'));
    btn.nativeElement.click();
    fixture.detectChanges();

    expect(component.sidebarCollapsed()).toBeTrue();
  });

  it('shouldShowOnlyPermittedModulesBasedOnRoles', () => {
    hasDashboardRole.set(true);
    hasFinanceRole.set(false);
    hasUserRole.set(false);
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.sidebar-nav-item');
    const labels = Array.from(items).map((el: any) => el.textContent?.trim() ?? '');

    expect(labels.some((l) => l.includes('Dashboard'))).toBeTrue();
    expect(labels.some((l) => l.includes('Finança'))).toBeFalse();
    expect(labels.some((l) => l.includes('Perfil'))).toBeFalse();
  });

  it('shouldCallLogoutOnSairClick', () => {
    const sairBtn = fixture.nativeElement.querySelector('.sidebar-nav-btn');
    sairBtn.click();
    expect(logoutSpy).toHaveBeenCalledTimes(1);
  });
});
