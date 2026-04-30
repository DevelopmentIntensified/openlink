import type { Handle } from '@sveltejs/kit';
import { checkRouteAccess, getUserRoles } from '$lib/server/rbac/route-guard';
import { auth } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	// Skip auth check for login API (needed for role selection)
	if (event.url.pathname === '/api/auth/login') {
		return resolve(event);
	}

	// Get session and user
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	let userRoles: string[] | null = null;

	if (session?.user) {
		userRoles = getUserRoles(session.user);
		event.locals.user = session.user;
	}

	// Check route access using deep module
	const routeCheck = checkRouteAccess(event.url.pathname, userRoles);

	if (!routeCheck.allowed && routeCheck.redirect) {
		return new Response(null, {
			status: 302,
			headers: { Location: routeCheck.redirect }
		});
	}

	return resolve(event);
};

// Extend app locals type
declare global {
	namespace App {
		interface Locals {
			user?: any;
		}
	}
}
