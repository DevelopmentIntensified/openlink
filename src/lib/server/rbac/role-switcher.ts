import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { getRoles } from '$lib/server/rbac';
import type { UserWithRoles } from '$lib/server/rbac';

/**
 * Deep module: Role switcher logic
 * No UI dependencies - pure logic for testability
 */
export function canSwitchRole(userRoles: string[]): boolean {
	return userRoles.includes('dev') && userRoles.includes('sponsor');
}

export function getCurrentRole(pathname: string): string | null {
	if (pathname.startsWith('/dev/')) {
		return 'dev';
	}

	if (pathname.startsWith('/sponsor/')) {
		return 'sponsor';
	}

	if (pathname.startsWith('/admin/')) {
		return 'admin';
	}

	return null;
}

export function getSwitchTarget(currentRole: string): string {
	if (currentRole === 'dev') {
		return 'sponsor';
	}

	return 'dev';
}

export function getSwitchPath(currentPath: string, targetRole: string): string {
	// Replace the role prefix in the path
	if (currentPath.startsWith('/dev/')) {
		return currentPath.replace('/dev/', `/${targetRole}/`);
	}

	if (currentPath.startsWith('/sponsor/')) {
		return currentPath.replace('/sponsor/', `/${targetRole}/`);
	}

	// If no current role prefix, go to target role's dashboard
	return `/${targetRole}/dashboard`;
}

export function handleRoleSwitch(currentPath: string, targetRole: string) {
	if (!browser) return;

	const newPath = getSwitchPath(currentPath, targetRole);
	goto(newPath);
}

export function getAvailableRoles(userRoles: string[]): string[] {
	return userRoles.filter((role) => ['dev', 'sponsor', 'admin'].includes(role));
}
