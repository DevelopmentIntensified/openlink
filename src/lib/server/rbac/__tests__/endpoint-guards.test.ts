import { describe, it, expect } from 'vitest';
import {
	canClaimBounty,
	canPostBounty,
	canSubmitWork,
	canReviewSubmission,
	canManageProjects,
	canAccessAdmin,
	requirePermission
} from '../endpoint-guards';
import type { UserWithRoles } from '../index';

describe('Endpoint Guards', () => {
	const devUser: UserWithRoles = { id: '1', roles: ['dev'] };
	const sponsorUser: UserWithRoles = { id: '2', roles: ['sponsor'] };
	const adminUser: UserWithRoles = { id: '3', roles: ['dev', 'admin'] };
	const dualUser: UserWithRoles = { id: '4', roles: ['dev', 'sponsor'] };

	describe('canClaimBounty', () => {
		it('should allow dev to claim bounty', () => {
			const check = canClaimBounty(devUser);
			expect(check.allowed).toBe(true);
		});

		it('should deny sponsor from claiming bounty', () => {
			const check = canClaimBounty(sponsorUser);
			expect(check.allowed).toBe(false);
			expect(check.reason).toContain('Only developers');
		});

		it('should deny unauthenticated user', () => {
			const check = canClaimBounty(null);
			expect(check.allowed).toBe(false);
			expect(check.reason).toContain('Authentication required');
		});

		it('should allow dual-role user (dev) to claim', () => {
			const check = canClaimBounty(dualUser);
			expect(check.allowed).toBe(true);
		});
	});

	describe('canPostBounty', () => {
		it('should allow sponsor to post bounty', () => {
			const check = canPostBounty(sponsorUser);
			expect(check.allowed).toBe(true);
		});

		it('should deny dev from posting bounty', () => {
			const check = canPostBounty(devUser);
			expect(check.allowed).toBe(false);
			expect(check.reason).toContain('Only sponsors');
		});

		it('should allow dual-role user (sponsor) to post', () => {
			const check = canPostBounty(dualUser);
			expect(check.allowed).toBe(true);
		});
	});

	describe('canSubmitWork', () => {
		it('should allow dev to submit work', () => {
			const check = canSubmitWork(devUser);
			expect(check.allowed).toBe(true);
		});

		it('should deny sponsor from submitting work', () => {
			const check = canSubmitWork(sponsorUser);
			expect(check.allowed).toBe(false);
		});
	});

	describe('canReviewSubmission', () => {
		it('should allow sponsor to review', () => {
			const check = canReviewSubmission(sponsorUser);
			expect(check.allowed).toBe(true);
		});

		it('should deny dev from reviewing', () => {
			const check = canReviewSubmission(devUser);
			expect(check.allowed).toBe(false);
		});
	});

	describe('canManageProjects', () => {
		it('should allow dev to manage projects', () => {
			const check = canManageProjects(devUser);
			expect(check.allowed).toBe(true);
		});

		it('should deny sponsor from managing projects', () => {
			const check = canManageProjects(sponsorUser);
			expect(check.allowed).toBe(false);
		});
	});

	describe('canAccessAdmin', () => {
		it('should allow admin to access', () => {
			const check = canAccessAdmin(adminUser);
			expect(check.allowed).toBe(true);
		});

		it('should deny non-admin from admin access', () => {
			const check = canAccessAdmin(devUser);
			expect(check.allowed).toBe(false);
			expect(check.reason).toContain('Admin access required');
		});
	});

	describe('requirePermission', () => {
		it('should return null if permission allowed', () => {
			const check = { allowed: true };
			const result = requirePermission(check);
			expect(result).toBeNull();
		});

		it('should return error Response if permission denied', () => {
			const check = { allowed: false, reason: 'Access denied' };
			const result = requirePermission(check);
			expect(result).toBeInstanceOf(Response);
			expect(result?.status).toBe(403);
		});
	});
});
