import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getBountyWithProject } from '$lib/server/lib/bounties';
import { claimBounty, submitBounty, completeBounty } from '$lib/server/lib/bounties';
import { getBountyById } from '$lib/server/lib/bounties';

export const load: PageServerLoad = async (event) => {
	const bountyId = event.params.id;

	if (!bountyId) {
		throw error(404, 'Bounty not found');
	}

	const bounty = await getBountyWithProject(bountyId);

	if (!bounty) {
		throw error(404, 'Bounty not found');
	}

	const session = event.locals.session;
	const isOwner = session?.userId === bounty.project?.ownerId;
	const isAssignee = session?.userId === bounty.assignedTo;
	const user = session?.userId || null;

	return {
		bounty,
		isOwner,
		isAssignee,
		user
	};
};

export const actions: Actions = {
	claim: async (event) => {
		const session = event.locals.session;

		if (!session) {
			throw redirect(302, '/login');
		}

		const bountyId = event.params.id;
		await claimBounty(bountyId, session.userId);

		return { success: true };
	},

	submit: async (event) => {
		const session = event.locals.session;

		if (!session) {
			throw redirect(302, '/login');
		}

		const formData = await event.request.formData();
		const prLink = formData.get('prLink')?.toString() || '';
		const notes = formData.get('notes')?.toString() || '';

		if (!prLink) {
			return { error: 'PR link is required' };
		}

		const bountyId = event.params.id;
		await submitBounty(bountyId, prLink, notes || undefined);

		return { success: true };
	},

	approve: async (event) => {
		const session = event.locals.session;

		if (!session) {
			throw redirect(302, '/login');
		}

		const bountyId = event.params.id;
		await completeBounty(bountyId);

		return { success: true };
	},

	reject: async (event) => {
		const session = event.locals.session;

		if (!session) {
			throw redirect(302, '/login');
		}

		const bountyId = event.params.id;
		// For reject, we need to reset to in_progress
		// This function doesn't exist yet, but we can update the status directly
		const { db } = await import('$lib/server/db');
		const { bounties } = await import('$lib/server/db/schema');
		const { eq } = await import('drizzle-orm');
		
		await db.update(bounties).set({
			status: 'in_progress',
			submissionPR: null,
			submissionNotes: null
		}).where(eq(bounties.id, bountyId));

		return { success: true };
	}
};
