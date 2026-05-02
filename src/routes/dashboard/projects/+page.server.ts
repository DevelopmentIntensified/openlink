import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { projects, bounties } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async (event) => {
	const session = await event.locals.auth.api.getSession({ headers: event.request.headers });

	if (!session?.user) {
		throw redirect(302, '/login');
	}

	const userProjects = await db
		.select()
		.from(projects)
		.where(eq(projects.ownerId, session.user.id));

	// Get bounty counts for each project
	const projectsWithStats = await Promise.all(
		userProjects.map(async (project) => {
			const projectBounties = await db
				.select()
				.from(bounties)
				.where(eq(bounties.projectId, project.id));

			const totalBounties = projectBounties.length;
			const activeBounties = projectBounties.filter(b => b.status === 'open').length;
			const totalValue = projectBounties.reduce((sum, b) => sum + b.amount, 0);

			return {
				...project,
				stats: {
					totalBounties,
					activeBounties,
					totalValue
				}
			};
		})
	);

	return {
		user: session.user,
		projects: projectsWithStats
	};
};
