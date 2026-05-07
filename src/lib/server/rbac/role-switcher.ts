import { getRoles } from '$lib/server/rbac';
import type { UserWithRoles } from '$lib/server/rbac';

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
	if (currentPath.startsWith('/dev/')) {
		return currentPath.replace('/dev/', `/${targetRole}/`);
	}

	if (currentPath.startsWith('/sponsor/')) {
		return currentPath.replace('/sponsor/', `/${targetRole}/`);
	}

	return `/${targetRole}/dashboard`;
}

export function getAvailableRoles(userRoles: string[]): string[] {
	return userRoles.filter((role) => ['dev', 'sponsor', 'admin'].includes(role));
}

export function handleRoleSwitch(currentPath: string, userRoles: string[]): string {
	if (!canSwitchRole(userRoles)) {
		return currentPath;
	}

	const currentRole = getCurrentRole(currentPath);
	const targetRole = getSwitchTarget(currentRole || 'dev');
	return getSwitchPath(currentPath, targetRole);
}
