import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { projects, users, bounties } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals }) => {
	const project = await db.query.projects.findFirst({
		where: eq(projects.id, params.id),
		with: {
			owner: {
				columns: {
					id: true,
					username: true,
					avatarUrl: true
				}
			}
		}
	});

	if (!project) {
		throw error(404, 'Project not found');
	}

	const projectBounties = await db.select({
		id: bounties.id,
		title: bounties.title,
		description: bounties.description,
		amount: bounties.amount,
		status: bounties.status,
		createdAt: bounties.createdAt
	}).from(bounties).where(eq(bounties.projectId, params.id));

	return {
		project,
		bounties: projectBounties,
		user: locals.user
	};
};
