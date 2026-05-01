import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { UserWithRoles } from '$lib/server/rbac';
import { getRoles } from '$lib/server/rbac';
import { db } from '$lib/server/db';
import { projects, bounties } from '$lib/server/db/schema';
import { eq, count } from 'drizzle-orm';

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

	// Get roles on server
	const roles = getRoles(user);

	// Get sponsor's projects
	const sponsorProjects = await db
		.select()
		.from(projects)
		.where(eq(projects.ownerId, user.id));

	// Get bounty count for sponsor's projects
	const projectIds = sponsorProjects.map((p) => p.id);
	const bountyCount = projectIds.length > 0
		? await db
			.select({ count: count() })
			.from(bounties)
			.where(eq(bounties.projectId, projectIds[0])) // Simplified for MVP
		: { count: 0 };

	return {
		user,
		roles,
		isSponsor: roles.includes('sponsor'),
		projects: sponsorProjects,
		bountyCount: bountyCount.count || 0
	};
};
