import { hasRequiredAccess } from './role.guard';
import { AppRole } from './auth.service';

describe('role.guard helper', () => {
  it('should allow when user has all required roles', () => {
    const granted = ['USER', 'FINANCE'];
    const required: AppRole[] = ['FINANCE'];
    expect(hasRequiredAccess(granted, required)).toBeTrue();
  });

  it('should deny when missing required role', () => {
    const granted = ['USER'];
    const required: AppRole[] = ['FINANCE'];
    expect(hasRequiredAccess(granted, required)).toBeFalse();
  });

  it('should allow when user has ADMIN role regardless of required roles', () => {
    const granted = ['ADMIN'];
    const required: AppRole[] = ['FINANCE'];
    expect(hasRequiredAccess(granted, required)).toBeTrue();
  });
});
