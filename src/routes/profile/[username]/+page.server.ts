import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, projects, bounties } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals }) => {
	const profileUser = await db.query.users.findFirst({
		where: eq(users.username, params.username)
	});

	if (!profileUser) {
		throw error(404, 'User not found');
	}

	const userProjects = await db.select({
		id: projects.id,
		name: projects.name,
		description: projects.description,
		type: projects.type,
		isBountyEnabled: projects.isBountyEnabled,
		createdAt: projects.createdAt
	}).from(projects).where(eq(projects.ownerId, profileUser.id));

	const userBounties = await db.select({
		id: bounties.id,
		title: bounties.title,
		amount: bounties.status,
		projectId: bounties.projectId,
		status: bounties.status
	}).from(bounties).where(eq(bounties.assignedTo, profileUser.id));

	return {
		profileUser,
		projects: userProjects,
		bounties: userBounties,
		user: locals.user
	};
};
