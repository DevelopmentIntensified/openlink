import type { UserWithRoles } from './index';

export interface PermissionCheck {
	allowed: boolean;
	reason?: string;
}

/**
 * Deep module: Endpoint guard functions
 * Pure functions that check if a user can perform specific actions
 * No SvelteKit dependencies - fully testable
 */

export function canClaimBounty(user: UserWithRoles | null): PermissionCheck {
	if (!user) {
		return { allowed: false, reason: 'Authentication required' };
	}

	if (!user.roles?.includes('dev')) {
		return { allowed: false, reason: 'Only developers can claim bounties' };
	}

	return { allowed: true };
}

export function canPostBounty(user: UserWithRoles | null): PermissionCheck {
	if (!user) {
		return { allowed: false, reason: 'Authentication required' };
	}

	if (!user.roles?.includes('sponsor')) {
		return { allowed: false, reason: 'Only sponsors can post bounties' };
	}

	return { allowed: true };
}

export function canSubmitWork(user: UserWithRoles | null): PermissionCheck {
	if (!user) {
		return { allowed: false, reason: 'Authentication required' };
	}

	if (!user.roles?.includes('dev')) {
		return { allowed: false, reason: 'Only developers can submit work' };
	}

	return { allowed: true };
}

export function canReviewSubmission(user: UserWithRoles | null): PermissionCheck {
	if (!user) {
		return { allowed: false, reason: 'Authentication required' };
	}

	if (!user.roles?.includes('sponsor')) {
		return { allowed: false, reason: 'Only sponsors can review submissions' };
	}

	return { allowed: true };
}

export function canManageProjects(user: UserWithRoles | null): PermissionCheck {
	if (!user) {
		return { allowed: false, reason: 'Authentication required' };
	}

	if (!user.roles?.includes('dev')) {
		return { allowed: false, reason: 'Only developers can manage projects' };
	}

	return { allowed: true };
}

export function canAccessAdmin(user: UserWithRoles | null): PermissionCheck {
	if (!user) {
		return { allowed: false, reason: 'Authentication required' };
	}

	const hasAdmin = user.roles?.includes('admin') || false;

	if (!hasAdmin) {
		return { allowed: false, reason: 'Admin access required' };
	}

	return { allowed: true };
}

/**
 * Convert PermissionCheck to Response if not allowed
 * For use in SvelteKit endpoints
 */
export function requirePermission(check: PermissionCheck): Response | null {
	if (!check.allowed) {
		return new Response(JSON.stringify({ error: check.reason }), {
			status: 403,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	return null;
}
