import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getBountyWithProject } from '$lib/server/lib/bounties';
import { claimBounty, submitBounty, completeBounty } from '$lib/server/lib/bounties';

export const load: PageServerLoad = async (event) => {
	const bountyId = event.params.bountyId;
	
	if (!bountyId) {
		throw error(404, 'Bounty not found');
	}
	
	const bounty = await getBountyWithProject(bountyId);
	
	if (!bounty) {
		throw error(404, 'Bounty not found');
	}
	
	const session = event.locals.session;
	const isOwner = session?.userId === bounty.project?.ownerId;
	const isAssignee = session?.userId === bounty.assignee?.id;
	
	return {
		bounty,
		isOwner,
		isAssignee,
		user: session?.userId
	};
};

export const actions: Actions = {
	claim: async (event) => {
		const session = event.locals.session;
		if (!session) {
			throw redirect(302, '/login');
		}
		
		const bountyId = event.params.bountyId;
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
		
		const bountyId = event.params.bountyId;
		await submitBounty(bountyId, prLink, notes || undefined);
		
		return { success: true };
	},
	
	complete: async (event) => {
		const session = event.locals.session;
		if (!session) {
			throw redirect(302, '/login');
		}
		
		const bountyId = event.params.bountyId;
		await completeBounty(bountyId);
		
		return { success: true };
	}
};
