import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { user, projects, bounties } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const username = event.params.username;
	
	if (!username) {
		throw error(404, 'User not found');
	}
	
	const userResult = await db.select().from(users).where(eq(users.username, username));
	
	if (!userResult[0]) {
		throw error(404, 'User not found');
	}
	
	const user = userResult[0];
	
	const userProjects = await db.select().from(projects).where(eq(projects.ownerId, user.id));
	
	const createdBounties = await db.select().from(bounties).where(eq(bounties.createdBy, user.id));
	
	const completedBounties = await db.select().from(bounties).where(eq(bounties.assignedTo, user.id));
	
	return {
		user,
		projects: userProjects,
		createdBounties,
		completedBounties
	};
};
