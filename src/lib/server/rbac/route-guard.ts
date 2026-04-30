import type { UserWithRoles } from './index';

export interface RouteCheckResult {
	allowed: boolean;
	redirect?: string;
}

/**
 * Pure function to check if a route is accessible by user roles.
 * Deep implementation: handles all route prefix logic, role checks, and redirect rules.
 * No SvelteKit dependencies - fully testable.
 */
export function checkRouteAccess(
	route: string,
	userRoles: string[] | null
): RouteCheckResult {
	// Define protected route prefixes and their required roles
	const protectedRoutes = [
		{ prefix: '/dev/', role: 'dev' },
		{ prefix: '/sponsor/', role: 'sponsor' },
		{ prefix: '/admin/', role: 'admin' }
	];

	// Check if route matches any protected prefix
	const matchedRoute = protectedRoutes.find((r) => route.startsWith(r.prefix));

	// If no match, route is public
	if (!matchedRoute) {
		return { allowed: true };
	}

	// Public sub-routes that don't require auth
	const publicSubRoutes = ['signup', 'login'];
	const isPublicSubRoute = publicSubRoutes.some((sub) => route.includes(`/${sub}`));

	if (isPublicSubRoute) {
		return { allowed: true };
	}

	// Unauthenticated user
	if (!userRoles) {
		return { allowed: false, redirect: '/auth/login' };
	}

	// Empty roles array = no access
	if (userRoles.length === 0) {
		const roleParam = matchedRoute.role;
		return { allowed: false, redirect: `/auth/signup?role=${roleParam}` };
	}

	// Check if user has required role
	const hasRequiredRole = userRoles.includes(matchedRoute.role);

	if (!hasRequiredRole) {
		const roleParam = matchedRoute.role;
		return { allowed: false, redirect: `/auth/signup?role=${roleParam}` };
	}

	return { allowed: true };
}

/**
 * Helper to extract roles from user object
 */
export function getUserRoles(user: UserWithRoles | null): string[] | null {
	if (!user) {
		return null;
	}

	return user.roles || null;
}
