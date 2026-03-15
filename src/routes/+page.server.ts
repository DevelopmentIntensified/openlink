import type { PageServerLoad } from './$types';
import { getFeaturedProjects } from '$lib/server/lib/projects';

export const load: PageServerLoad = async () => {
	const featuredProjects = await getFeaturedProjects(6);
	
	return {
		featuredProjects
	};
};
