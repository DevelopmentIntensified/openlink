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
	
	const userResult = await db.select().from(user).where(eq(user.username, username));
	
	if (!userResult[0]) {
		throw error(404, 'User not found');
	}
	
	const profileUser = userResult[0];
	
	const userProjects = await db.select().from(projects).where(eq(projects.ownerId, profileUser.id));
	
	const createdBounties = await db.select().from(bounties).where(eq(bounties.createdBy, profileUser.id));
	
	const completedBounties = await db.select().from(bounties).where(eq(bounties.assignedTo, profileUser.id));
	
	return {
		user: profileUser,
		projects: userProjects,
		createdBounties,
		completedBounties
	};
};
