import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getProjectWithBounties } from '$lib/server/lib/projects';

export const load: PageServerLoad = async (event) => {
	const id = event.params.id;
	
	if (!id) {
		throw error(404, 'Project not found');
	}
	
	const project = await getProjectWithBounties(id);
	
	if (!project) {
		throw error(404, 'Project not found');
	}
	
	return {
		project
	};
};
