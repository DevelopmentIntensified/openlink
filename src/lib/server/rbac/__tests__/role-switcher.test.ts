import { describe, it, expect } from 'vitest';
import {
	canSwitchRole,
	getCurrentRole,
	getSwitchTarget,
	getSwitchPath,
	getAvailableRoles
} from '../role-switcher';

describe('Role Switcher Logic', () => {
	describe('canSwitchRole', () => {
		it('should return true for dual-role user (dev + sponsor)', () => {
			expect(canSwitchRole(['dev', 'sponsor'])).toBe(true);
		});

		it('should return false for dev-only user', () => {
			expect(canSwitchRole(['dev'])).toBe(false);
		});

		it('should return false for sponsor-only user', () => {
			expect(canSwitchRole(['sponsor'])).toBe(false);
		});

		it('should return true for user with dev, sponsor, and admin', () => {
			expect(canSwitchRole(['dev', 'sponsor', 'admin'])).toBe(true);
		});

		it('should return false for empty roles', () => {
			expect(canSwitchRole([])).toBe(false);
		});
	});

	describe('getCurrentRole', () => {
		it('should return "dev" for /dev/* paths', () => {
			expect(getCurrentRole('/dev/dashboard')).toBe('dev');
			expect(getCurrentRole('/dev/bounties')).toBe('dev');
		});

		it('should return "sponsor" for /sponsor/* paths', () => {
			expect(getCurrentRole('/sponsor/dashboard')).toBe('sponsor');
			expect(getCurrentRole('/sponsor/bounties/post')).toBe('sponsor');
		});

		it('should return "admin" for /admin/* paths', () => {
			expect(getCurrentRole('/admin/dashboard')).toBe('admin');
		});

		it('should return null for non-role paths', () => {
			expect(getCurrentRole('/')).toBeNull();
			expect(getCurrentRole('/auth/login')).toBeNull();
		});
	});

	describe('getSwitchTarget', () => {
		it('should return "sponsor" when current role is "dev"', () => {
			expect(getSwitchTarget('dev')).toBe('sponsor');
		});

		it('should return "dev" when current role is "sponsor"', () => {
			expect(getSwitchTarget('sponsor')).toBe('dev');
		});

		it('should return "dev" for unknown role', () => {
			expect(getSwitchTarget('admin')).toBe('dev');
		});
	});

	describe('getSwitchPath', () => {
		it('should switch /dev/* to /sponsor/*', () => {
			expect(getSwitchPath('/dev/dashboard', 'sponsor')).toBe('/sponsor/dashboard');
			expect(getSwitchPath('/dev/bounties/123', 'sponsor')).toBe('/sponsor/bounties/123');
		});

		it('should switch /sponsor/* to /dev/*', () => {
			expect(getSwitchPath('/sponsor/dashboard', 'dev')).toBe('/dev/dashboard');
		});

		it('should handle paths without role prefix', () => {
			expect(getSwitchPath('/some/path', 'dev')).toBe('/dev/dashboard');
		});
	});

	describe('getAvailableRoles', () => {
		it('should return only valid roles', () => {
			expect(getAvailableRoles(['dev', 'sponsor', 'invalid'])).toEqual(['dev', 'sponsor']);
		});

		it('should include admin if present', () => {
			expect(getAvailableRoles(['dev', 'admin'])).toEqual(['dev', 'admin']);
		});

		it('should return empty array for no valid roles', () => {
			expect(getAvailableRoles(['invalid'])).toEqual([]);
		});
	});
});
