import type { UserWithRoles } from './index';

/**
 * Deep module: Admin user management
 * Pure functions for admin role operations
 */

/**
 * Check if user has admin role
 */
export function isAdmin(user: UserWithRoles): boolean {
	return user.roles ? user.roles.includes('admin') : false;
}

/**
 * Add admin role to user's roles array
 */
export function addAdminRole(user: UserWithRoles): string[] {
	const currentRoles = user.roles || ['dev'];

	if (!currentRoles.includes('admin')) {
		return [...currentRoles, 'admin'];
	}

	return currentRoles;
}

/**
 * Remove admin role from user's roles array
 */
export function removeAdminRole(user: UserWithRoles): string[] {
	const currentRoles = user.roles || ['dev'];

	return currentRoles.filter((role) => role !== 'admin');
}

/**
 * Get all admin users (helper for admin dashboard)
 */
export function filterAdminUsers(users: UserWithRoles[]): UserWithRoles[] {
	return users.filter((user) => isAdmin(user));
}

/**
 * Validate admin operation
 */
export function canModifyAdminRole(
	currentUser: UserWithRoles,
	targetUser: UserWithRoles
): { allowed: boolean; reason?: string } {
	// Can't modify your own admin status (prevent lockout)
	if (currentUser.id === targetUser.id) {
		return { allowed: false, reason: 'Cannot modify your own admin role' };
	}

	// Must be admin to modify admin roles
	if (!isAdmin(currentUser)) {
		return { allowed: false, reason: 'Admin access required' };
	}

	return { allowed: true };
}
