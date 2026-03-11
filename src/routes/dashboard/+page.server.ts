import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { projects, users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const userProjects = await db.select({
		id: projects.id,
		name: projects.name,
		description: projects.description,
		type: projects.type,
		isBountyEnabled: projects.isBountyEnabled,
		createdAt: projects.createdAt
	}).from(projects).where(eq(projects.ownerId, locals.user.id));

	return {
		user: locals.user,
		projects: userProjects
	};
};
