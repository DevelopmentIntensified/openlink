import { describe, it, expect } from 'vitest';
import {
	isAdmin,
	addAdminRole,
	removeAdminRole,
	filterAdminUsers,
	canModifyAdminRole
} from '../admin';
import type { UserWithRoles } from '../index';

describe('Admin Module', () => {
	const devUser: UserWithRoles = { id: '1', roles: ['dev'] };
	const sponsorUser: UserWithRoles = { id: '2', roles: ['sponsor'] };
	const adminUser: UserWithRoles = { id: '3', roles: ['dev', 'admin'] };
	const superAdmin: UserWithRoles = { id: '4', roles: ['dev', 'sponsor', 'admin'] };

	describe('isAdmin', () => {
		it('should return true for admin user', () => {
			expect(isAdmin(adminUser)).toBe(true);
			expect(isAdmin(superAdmin)).toBe(true);
		});

		it('should return false for non-admin user', () => {
			expect(isAdmin(devUser)).toBe(false);
			expect(isAdmin(sponsorUser)).toBe(false);
		});

		it('should return false for user with no roles', () => {
			const noRoles: UserWithRoles = { id: '5' };
			expect(isAdmin(noRoles)).toBe(false);
		});
	});

	describe('addAdminRole', () => {
		it('should add admin to dev user', () => {
			const newRoles = addAdminRole(devUser);
			expect(newRoles).toContain('admin');
			expect(newRoles).toContain('dev');
		});

		it('should not duplicate admin role', () => {
			const newRoles = addAdminRole(adminUser);
			expect(newRoles.filter((r) => r === 'admin')).toHaveLength(1);
		});

		it('should add admin to sponsor user', () => {
			const newRoles = addAdminRole(sponsorUser);
			expect(newRoles).toEqual(['sponsor', 'admin']);
		});
	});

	describe('removeAdminRole', () => {
		it('should remove admin from admin user', () => {
			const newRoles = removeAdminRole(adminUser);
			expect(newRoles).not.toContain('admin');
			expect(newRoles).toContain('dev');
		});

		it('should not affect user without admin', () => {
			const newRoles = removeAdminRole(devUser);
			expect(newRoles).toEqual(['dev']);
		});
	});

	describe('filterAdminUsers', () => {
		it('should return only admin users', () => {
			const users = [devUser, sponsorUser, adminUser, superAdmin];
			const admins = filterAdminUsers(users);
			expect(admins).toHaveLength(2);
			expect(admins).toContain(adminUser);
			expect(admins).toContain(superAdmin);
		});

		it('should return empty array if no admins', () => {
			const users = [devUser, sponsorUser];
			const admins = filterAdminUsers(users);
			expect(admins).toHaveLength(0);
		});
	});

	describe('canModifyAdminRole', () => {
		it('should not allow modifying own admin role', () => {
			const result = canModifyAdminRole(adminUser, adminUser);
			expect(result.allowed).toBe(false);
			expect(result.reason).toContain('Cannot modify your own');
		});

		it('should not allow non-admin to modify admin roles', () => {
			const result = canModifyAdminRole(devUser, adminUser);
			expect(result.allowed).toBe(false);
			expect(result.reason).toContain('Admin access required');
		});

		it('should allow admin to modify other user admin role', () => {
			const result = canModifyAdminRole(adminUser, devUser);
			expect(result.allowed).toBe(true);
		});
	});
});
