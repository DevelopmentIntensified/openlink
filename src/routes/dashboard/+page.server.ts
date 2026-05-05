import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { projects, bounties, user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async (event) => {
	// Use event.locals.auth exposed by hooks
	const session = await event.locals.auth.api.getSession({
		headers: event.request.headers
	});

	if (!session?.user) {
		// Redirect to login if not authenticated
		throw redirect(303, '/login');
	}

	try {
		const userProjects = await db
			.select()
			.from(projects)
			.where(eq(projects.ownerId, session.user.id));

		// Simplified bounties query - select specific columns that exist
		const userBounties = await db
			.select({
				id: bounties.id,
				projectId: bounties.projectId,
				title: bounties.title,
				description: bounties.description,
				amount: bounties.amount,
				priority: bounties.priority,
				deadline: bounties.deadline,
				status: bounties.status,
				createdBy: bounties.createdBy,
				assignedTo: bounties.assignedTo
			})
			.from(bounties)
			.where(eq(bounties.createdBy, session.user.id));

		return {
			user: session.user,
			userProjects,
			userBounties
		};
	} catch (error) {
		console.error('Dashboard load error:', error);
		return {
			user: session.user,
			userProjects: [],
			userBounties: [],
			error: 'Failed to load dashboard data'
		};
	}
};
