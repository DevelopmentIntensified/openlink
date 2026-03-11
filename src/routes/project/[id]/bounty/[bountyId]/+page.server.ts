import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { projects, bounties, users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { createBountyCheckout } from '$lib/server/salable';

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
	},
	fund: async ({ params, locals }) => {
		if (!locals.user) {
			throw error(401, 'Must be logged in');
		}

		const bounty = await db.query.bounties.findFirst({
			where: eq(bounties.id, params.bountyId)
		});

		if (!bounty) {
			throw error(404, 'Bounty not found');
		}

		try {
			const checkout = await createBountyCheckout({
				bountyId: bounty.id,
				amount: bounty.amount,
				bountyTitle: bounty.title,
				successUrl: `${process.env.PUBLIC_URL}/project/${bounty.projectId}/bounty/${bounty.id}?funded=true`,
				cancelUrl: `${process.env.PUBLIC_URL}/project/${bounty.projectId}/bounty/${bounty.id}?canceled=true`
			});

			if (checkout?.checkoutUrl) {
				await db.update(bounties).set({
					salableCheckoutId: bounty.id
				}).where(eq(bounties.id, params.bountyId));

				throw redirect(302, checkout.checkoutUrl);
			}

			return { error: 'Failed to create checkout' };
		} catch (err) {
			if (err instanceof redirect) {
				throw err;
			}
			console.error('Fund error:', err);
			return { error: 'Failed to create checkout' };
		}
	}
};
