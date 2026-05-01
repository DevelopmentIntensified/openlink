import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { UserWithRoles } from '$lib/server/rbac';
import { getRoles } from '$lib/server/rbac';

export const load: PageServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session?.user) {
		throw redirect(302, '/auth/login');
	}

	const user = session.user as UserWithRoles;

	// Check if user has dev role
	if (!user.roles?.includes('dev')) {
		throw redirect(302, '/auth/signup?role=dev');
	}

	// Get roles on server
	const roles = getRoles(user);

	return {
		user,
		roles
	};
};
