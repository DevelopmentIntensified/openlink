import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { projects, users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('q') || '';
	const type = url.searchParams.get('type') || '';
	
	let query = db.select({
		id: projects.id,
		name: projects.name,
		description: projects.description,
		type: projects.type,
		isBountyEnabled: projects.isBountyEnabled,
		ownerId: projects.ownerId,
		ownerUsername: users.username,
		createdAt: projects.createdAt
	}).from(projects).leftJoin(users, eq(projects.ownerId, users.id));

	let allProjects = await query;
	
	if (search) {
		allProjects = allProjects.filter(p => 
			p.name.toLowerCase().includes(search.toLowerCase()) ||
			p.description?.toLowerCase().includes(search.toLowerCase())
		);
	}
	
	if (type) {
		allProjects = allProjects.filter(p => p.type === type);
	}

	return {
		projects: allProjects,
		search,
		type
	};
};
