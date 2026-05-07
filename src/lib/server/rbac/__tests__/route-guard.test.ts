import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkRouteAccess, type RouteCheckResult } from '../route-guard';

describe('Route Guard - RBAC Enforcement', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('checkRouteAccess', () => {
		it('should allow access to /dev/* when user has dev role', () => {
			const result = checkRouteAccess('/dev/dashboard', ['dev']);

			expect(result.allowed).toBe(true);
			expect(result.redirect).toBeUndefined();
		});

		it('should deny access to /dev/* when user lacks dev role', () => {
			const result = checkRouteAccess('/dev/dashboard', ['sponsor']);

			expect(result.allowed).toBe(false);
			expect(result.redirect).toBe('/dev/signup');
		});

		it('should allow access to /sponsor/* when user has sponsor role', () => {
			const result = checkRouteAccess('/sponsor/bounties', ['sponsor']);

			expect(result.allowed).toBe(true);
		});

		it('should deny access to /sponsor/* when user lacks sponsor role', () => {
			const result = checkRouteAccess('/sponsor/dashboard', ['dev']);

			expect(result.allowed).toBe(false);
			expect(result.redirect).toBe('/sponsor/signup');
		});

		it('should allow access to /admin/* when user has admin role', () => {
			const result = checkRouteAccess('/admin/dashboard', ['dev', 'admin']);

			expect(result.allowed).toBe(true);
		});

		it('should deny access to /admin/* when user lacks admin role', () => {
			const result = checkRouteAccess('/admin/users', ['dev']);

			expect(result.allowed).toBe(false);
		});

		it('should skip auth check for signup routes', () => {
			const result = checkRouteAccess('/dev/signup', ['sponsor']);

			expect(result.allowed).toBe(true); // signup routes are public
		});

		it('should skip auth check for login routes', () => {
			const result = checkRouteAccess('/sponsor/login', ['dev']);

			expect(result.allowed).toBe(true);
		});

		it('should handle unauthenticated user on protected route', () => {
			const result = checkRouteAccess('/dev/dashboard', null);

			expect(result.allowed).toBe(false);
			expect(result.redirect).toBe('/login');
		});

		it('should allow access when user has both roles and visits either prefix', () => {
			const result1 = checkRouteAccess('/dev/dashboard', ['dev', 'sponsor']);
			const result2 = checkRouteAccess('/sponsor/dashboard', ['dev', 'sponsor']);

			expect(result1.allowed).toBe(true);
			expect(result2.allowed).toBe(true);
		});

		it('should handle empty roles array as no access', () => {
			const result = checkRouteAccess('/dev/dashboard', []);

			expect(result.allowed).toBe(false);
			expect(result.redirect).toBe('/dev/signup');
		});
	});
});
