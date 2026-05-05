import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getProjectById, updateProject } from '$lib/server/lib/projects';

export const load: PageServerLoad = async (event) => {
	const projectId = event.params.id;

	if (!projectId) {
		throw error(404, 'Project not found');
	}

	const project = await getProjectById(projectId);

	if (!project) {
		throw error(404, 'Project not found');
	}

	const user = event.locals.user;

	if (!user || project.ownerId !== user.id) {
		throw redirect(302, '/login');
	}

	return {
		project,
		user
	};
};

export const actions: Actions = {
	default: async (event) => {
		const user = event.locals.user;

		if (!user) {
			throw redirect(302, '/login');
		}

		const projectId = event.params.id;

		// Verify ownership
		const project = await getProjectById(projectId);
		if (!project || project.ownerId !== user.id) {
			throw error(403, 'Forbidden');
		}

		const formData = await event.request.formData();
		const name = formData.get('name')?.toString() || '';
		const description = formData.get('description')?.toString() || '';
		const repoUrl = formData.get('repoUrl')?.toString() || '';
		const website = formData.get('website')?.toString() || '';
		const category = formData.get('category')?.toString() || 'other';
		const type = (formData.get('type')?.toString() || 'individual') as
			| 'community'
			| 'team'
			| 'individual';
		const isBountyEnabled = formData.get('isBountyEnabled') === 'true';

		// Validation
		if (!name.trim()) {
			return {
				errors: { name: 'Name is required' },
				name,
				description,
				repoUrl,
				website,
				category,
				type,
				isBountyEnabled
			};
		}

		// Update project
		await updateProject(projectId, {
			name,
			description: description || undefined,
			repoUrl: repoUrl || undefined,
			website: website || undefined,
			category,
			type,
			isBountyEnabled
		});

		// Redirect to project detail page
		throw redirect(302, `/dashboard/project/${projectId}`);
	}
};
