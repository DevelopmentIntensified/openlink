import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { projects, bounties } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async (event) => {
	// Use event.locals.auth exposed by hooks
	const session = await event.locals.auth.api.getSession({
		headers: event.request.headers
	});

	if (!session?.user) {
		return {
			user: null,
			userProjects: [],
			userBounties: []
		};
	}

	const userProjects = await db
		.select()
		.from(projects)
		.where(eq(projects.ownerId, session.user.id));

	const userBounties = await db
		.select()
		.from(bounties)
		.where(eq(bounties.createdBy, session.user.id));

	return {
		user: session.user,
		userProjects,
		userBounties
	};
};
