import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getProjectById, updateProject, deleteProject } from '$lib/server/lib/projects';
import { getProjectWithBounties } from '$lib/server/lib/projects';

export const load: PageServerLoad = async (event) => {
	const projectId = event.params.id;

	if (!projectId) {
		throw error(404, 'Project not found');
	}

	const project = await getProjectWithBounties(projectId);

	if (!project) {
		throw error(404, 'Project not found');
	}

	const user = event.locals.user;
	const isOwner = user?.id === project.ownerId;

	return {
		project,
		isOwner,
		user
	};
};

export const actions: Actions = {
	delete: async (event) => {
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

		await deleteProject(projectId);

		throw redirect(302, '/dashboard/projects');
	}
};
