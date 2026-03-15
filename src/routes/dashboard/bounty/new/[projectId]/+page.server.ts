import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createBounty } from '$lib/server/lib/bounties';
import { getProjectById } from '$lib/server/lib/projects';

export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;
	
	if (!session) {
		throw redirect(302, '/login');
	}
	
	const projectId = event.params.projectId;
	const project = await getProjectById(projectId);
	
	if (!project) {
		throw redirect(302, '/dashboard');
	}
	
	if (project.ownerId !== session.userId) {
		throw redirect(302, '/dashboard');
	}
	
	if (!project.isBountyEnabled) {
		throw redirect(302, `/project/${projectId}`);
	}
	
	return {
		project
	};
};

export const actions: Actions = {
	default: async (event) => {
		const session = event.locals.session;
		
		if (!session) {
			throw redirect(302, '/login');
		}
		
		const formData = await event.request.formData();
		const projectId = event.params.projectId;
		
		const title = formData.get('title')?.toString() || '';
		const description = formData.get('description')?.toString() || '';
		const skills = formData.get('skills')?.toString() || '';
		const amountStr = formData.get('amount')?.toString() || '0';
		const priority = (formData.get('priority')?.toString() || 'medium') as 'low' | 'medium' | 'high' | 'urgent';
		const deadlineStr = formData.get('deadline')?.toString() || '';
		
		if (!title) {
			return fail(400, { error: 'Bounty title is required' });
		}
		
		const amount = Math.round(parseFloat(amountStr) * 100);
		if (isNaN(amount) || amount < 100) {
			return fail(400, { error: 'Amount must be at least $1.00' });
		}
		
		let deadline: Date | undefined;
		if (deadlineStr) {
			deadline = new Date(deadlineStr);
		}
		
		try {
			const bountyId = await createBounty({
				projectId,
				title,
				description: description || undefined,
				skills: skills || undefined,
				amount,
				priority,
				deadline,
				createdBy: session.userId
			});
			
			throw redirect(303, `/project/${projectId}`);
		} catch (error) {
			if (error instanceof Response && error.status === 303) {
				throw error;
			}
			console.error('Error creating bounty:', error);
			return fail(500, { error: 'Failed to create bounty' });
		}
	}
};
