import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { UserWithRoles } from '$lib/server/rbac';
import { getOnboardingStatus } from '$lib/server/dev/profile-logic';

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

	// Get onboarding status
	const onboardingStatus = getOnboardingStatus(user);

	return {
		user,
		onboardingComplete: onboardingStatus.onboardingComplete
	};
};
