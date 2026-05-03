import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getBountyWithProject } from '$lib/server/lib/bounties';
import { createBounty as createBountyInDb } from '$lib/server/lib/bounties';
import { getProjectsByOwner } from '$lib/server/projects/project-logic';

export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;

	if (!session) {
		throw redirect(302, '/login');
	}

	// Get sponsor's projects
	const projects = await getProjectsByOwner(session.userId);

	return {
		user: session.userId,
		projects
	};
};

export const actions: Actions = {
	default: async (event) => {
		const session = event.locals.session;

		if (!session) {
			throw redirect(302, '/login');
		}

		const formData = await event.request.formData();
		const title = formData.get('title')?.toString() || '';
		const description = formData.get('description')?.toString() || '';
		const amount = formData.get('amount')?.toString() || '';
		const skills = formData.get('skills')?.toString() || '';
		const priority = (formData.get('priority')?.toString() || 'medium') as
			| 'low'
			| 'medium'
			| 'high'
			| 'urgent';
		const deadline = formData.get('deadline')?.toString() || '';
		const projectId = formData.get('projectId')?.toString() || '';

		// Validation
		const errors: Record<string, string> = {};

		if (!title.trim()) {
			errors.title = 'Title is required';
		}

		const amountNum = parseFloat(amount);
		if (!amount || isNaN(amountNum) || amountNum <= 0) {
			errors.amount = 'Valid amount is required';
		}

		if (!projectId) {
			errors.projectId = 'Project is required';
		}

		if (Object.keys(errors).length > 0) {
			return { errors, title, description, amount, skills, priority, deadline, projectId };
		}

		// Convert dollars to cents for storage
		const amountInCents = Math.round(amountNum * 100);

		// Parse skills as array
		const skillsArray = skills
			.split(',')
			.map((s) => s.trim())
			.filter((s) => s.length > 0);

		// Parse deadline if provided
		let deadlineDate: Date | undefined;
		if (deadline) {
			deadlineDate = new Date(deadline + 'T23:59:59');
		}

		// Create the bounty
		const bountyId = await createBountyInDb({
			projectId,
			title,
			description: description || undefined,
			skills: skillsArray.length > 0 ? JSON.stringify(skillsArray) : undefined,
			amount: amountInCents,
			priority,
			deadline: deadlineDate,
			createdBy: session.userId
		});

		// Redirect to the bounties list on success
		throw redirect(302, '/dashboard/bounties');
	}
};
