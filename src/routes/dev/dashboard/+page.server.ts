import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { UserWithRoles } from '$lib/server/rbac';
import { getOnboardingStatus, getRoles } from '$lib/server/rbac';

export const load: PageServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session?.user) {
		throw redirect(302, '/login');
	}

	const user = session.user as UserWithRoles;

	// Check if user has dev role
	if (!user.roles?.includes('dev')) {
		throw redirect(302, '/auth/signup?role=dev');
	}

	// Get onboarding status and roles on server
	const onboardingStatus = getOnboardingStatus(user);
	const roles = getRoles(user);

	return {
		user,
		onboardingComplete: onboardingStatus.onboardingComplete,
		roles,
		hasProjects: roles.includes('dev')
	};
};
