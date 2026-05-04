import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createProject } from '$lib/server/lib/projects';

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const user = locals.user;

		if (!user) {
			return fail(401, { error: 'You must be logged in to create a project' });
		}

		const data = await request.formData();
		
		const name = data.get('name') as string;
		const description = data.get('description') as string;
		const repoUrl = data.get('repoUrl') as string;
		const website = data.get('website') as string;
		const category = data.get('category') as string;
		const type = data.get('type') as string;
		const isBountyEnabled = data.get('isBountyEnabled') === 'true';

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
