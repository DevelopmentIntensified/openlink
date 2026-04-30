import type { User } from 'better-auth';

export type UserWithRoles = User & {
	roles?: string[] | undefined;
};

const DEFAULT_ROLES = ['dev'] as const;

/**
 * Get roles array from user, with defaults applied.
 * Deep implementation: handles undefined, empty array, and valid roles.
 */
export function getRoles(user: UserWithRoles): string[] {
	if (!user.roles) {
		return [...DEFAULT_ROLES];
	}

	if (!Array.isArray(user.roles)) {
		return [...DEFAULT_ROLES];
	}

	return user.roles;
}

/**
 * Check if user has a specific role.
 * Deep implementation: handles defaults, case sensitivity, and missing roles.
 */
export function hasRole(user: UserWithRoles, role: string): boolean {
	const roles = getRoles(user);
	return roles.includes(role);
}

/**
 * Require a role for a SvelteKit request event.
 * Sets event.locals.user if authorized, returns false otherwise.
 * Deep implementation: integrates with SvelteKit's event system.
 */
export function requireRole(
	event: { locals: Record<string, any> },
	user: UserWithRoles,
	role: string
): boolean {
	if (!hasRole(user, role)) {
		return false;
	}

	event.locals.user = user;
	return true;
}
