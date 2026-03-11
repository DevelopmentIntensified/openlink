import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { projects, bounties, users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals }) => {
	const bounty = await db.query.bounties.findFirst({
		where: eq(bounties.id, params.bountyId),
		with: {
			project: {
				with: {
					owner: {
						columns: {
							id: true,
							username: true,
							avatarUrl: true
						}
					}
				}
			}
		}
	});

	if (!bounty) {
		throw error(404, 'Bounty not found');
	}

	return {
		bounty,
		user: locals.user
	};
};

export const actions: Actions = {
	claim: async ({ params, locals }) => {
		if (!locals.user) {
			throw error(401, 'Must be logged in');
		}

		await db.update(bounties).set({
			status: 'in_progress',
			assignedTo: locals.user.id
		}).where(eq(bounties.id, params.bountyId));

		return { success: true };
	},
	complete: async ({ params, locals }) => {
		if (!locals.user) {
			throw error(401, 'Must be logged in');
		}

		await db.update(bounties).set({
			status: 'completed'
		}).where(eq(bounties.id, params.bountyId));

		return { success: true };
	}
};
