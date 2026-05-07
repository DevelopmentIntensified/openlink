import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { UserWithRoles } from '$lib/server/rbac';
import { isAdmin } from '$lib/server/rbac/admin';

export const load: PageServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session?.user) {
		throw redirect(302, '/login');
	}

	const user = session.user as UserWithRoles;

	// Check if user has admin role
	if (!isAdmin(user)) {
		throw redirect(302, '/dev/dashboard');
	}

	return {
		user
	};
};
