import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { UserWithRoles } from '$lib/server/rbac';
import { shouldShowSponsorOnboarding } from '$lib/server/sponsor/profile-logic';

export const load: PageServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session?.user) {
		throw redirect(302, '/auth/login');
	}

	const user = session.user as UserWithRoles;

	// Check if user has sponsor role
	if (!user.roles?.includes('sponsor')) {
		throw redirect(302, '/auth/signup?role=sponsor');
	}

	return {
		user,
		showOnboarding: shouldShowSponsorOnboarding(user)
	};
};
