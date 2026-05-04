import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createProject } from '$lib/server/lib/projects';

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const user = locals.user;

		if (!user) {
			return fail(401, { error: 'You must be logged in to create a project' });
		}

		const body = await request.json();
		
		const { name, description, repoUrl, website, category, type, isBountyEnabled } = body;

		if (!name) {
			return fail(400, { error: 'Project name is required' });
		}

		try {
			const projectId = await createProject({
				name,
				description: description || undefined,
				repoUrl: repoUrl || undefined,
				website: website || undefined,
				category: category || 'other',
				ownerId: user.id,
				type: type || 'individual',
				isBountyEnabled: !!isBountyEnabled
			});
			return { projectId };
		} catch (error) {
			console.error('Error creating project:', error);
			return fail(500, { error: 'Failed to create project' });
		}
	}
};
