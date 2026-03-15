import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllProjects } from '$lib/server/lib/projects';

export const load: PageServerLoad = async (event) => {
	const url = event.url;
	const search = url.searchParams.get('search') || '';
	const category = url.searchParams.get('category') || '';
	
	const projects = await getAllProjects(50, 0);
	
	return {
		projects,
		search,
		category
	};
};
