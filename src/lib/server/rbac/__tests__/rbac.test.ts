import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRoles, hasRole, requireRole, type UserWithRoles } from '../index';

describe('RBAC Module', () => {
	describe('getRoles', () => {
		it('should return roles array from user with roles', () => {
			const user: UserWithRoles = {
				id: '1',
				roles: ['dev', 'sponsor']
			};

			const roles = getRoles(user);

			expect(roles).toEqual(['dev', 'sponsor']);
		});

		it('should return default roles when user has no roles', () => {
			const user: UserWithRoles = {
				id: '1',
				roles: undefined
			};

			const roles = getRoles(user);

			expect(roles).toEqual(['dev']); // default role
		});

		it('should return empty array for user with empty roles', () => {
			const user: UserWithRoles = {
				id: '1',
				roles: []
			};

			const roles = getRoles(user);

			expect(roles).toEqual([]);
		});
	});

	describe('hasRole', () => {
		it('should return true when user has the role', () => {
			const user: UserWithRoles = {
				id: '1',
				roles: ['dev', 'sponsor']
			};

			expect(hasRole(user, 'dev')).toBe(true);
			expect(hasRole(user, 'sponsor')).toBe(true);
		});

		it('should return false when user does not have the role', () => {
			const user: UserWithRoles = {
				id: '1',
				roles: ['dev']
			};

			expect(hasRole(user, 'sponsor')).toBe(false);
			expect(hasRole(user, 'admin')).toBe(false);
		});

		it('should return true for default role when user has no roles set', () => {
			const user: UserWithRoles = {
				id: '1',
				roles: undefined
			};

			expect(hasRole(user, 'dev')).toBe(true); // default
		});

		it('should handle admin role check', () => {
			const user: UserWithRoles = {
				id: '1',
				roles: ['dev', 'admin']
			};

			expect(hasRole(user, 'admin')).toBe(true);
			expect(hasRole(user, 'sponsor')).toBe(false);
		});
	});

	describe('requireRole', () => {
		let mockEvent: any;

		beforeEach(() => {
			mockEvent = {
				locals: {}
			};
		});

		it('should set user in event.locals when user has required role', () => {
			const user: UserWithRoles = {
				id: '1',
				roles: ['dev']
			};

			const result = requireRole(mockEvent, user, 'dev');

			expect(result).toBe(true);
			expect(mockEvent.locals.user).toEqual(user);
		});

		it('should return false when user lacks required role', () => {
			const user: UserWithRoles = {
				id: '1',
				roles: ['dev']
			};

			const result = requireRole(mockEvent, user, 'sponsor');

			expect(result).toBe(false);
			expect(mockEvent.locals.user).toBeUndefined();
		});

		it('should return true for admin role when user has admin', () => {
			const user: UserWithRoles = {
				id: '1',
				roles: ['dev', 'admin']
			};

			const result = requireRole(mockEvent, user, 'admin');

			expect(result).toBe(true);
		});

		it('should return false for admin role when user lacks admin', () => {
			const user: UserWithRoles = {
				id: '1',
				roles: ['sponsor']
			};

			const result = requireRole(mockEvent, user, 'admin');

			expect(result).toBe(false);
		});
	});
});
