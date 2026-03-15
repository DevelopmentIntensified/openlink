import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createProject } from '$lib/server/lib/projects';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.session;
	
	if (!session) {
		throw redirect(302, '/login');
	}
	
	return {
		user: event.locals.user
	};
};

export const actions: Actions = {
	default: async (event) => {
		const session = event.locals.session;
		
		if (!session) {
			throw redirect(302, '/login');
		}
		
		const formData = await event.request.formData();
		const name = formData.get('name')?.toString() || '';
		const description = formData.get('description')?.toString() || '';
		const repoUrl = formData.get('repoUrl')?.toString() || '';
		const website = formData.get('website')?.toString() || '';
		const category = formData.get('category')?.toString() || 'other';
		const type = (formData.get('type')?.toString() || 'individual') as 'community' | 'team' | 'individual';
		const isBountyEnabled = formData.get('isBountyEnabled') === 'on';
		
		if (!name) {
			return fail(400, { error: 'Project name is required' });
		}
		
		try {
			const projectId = await createProject({
				name,
				description: description || undefined,
				repoUrl: repoUrl || undefined,
				website: website || undefined,
				category,
				type,
				isBountyEnabled,
				ownerId: session.userId
			});
			
			throw redirect(303, `/project/${projectId}`);
		} catch (error) {
			if (error instanceof Response && error.status === 303) {
				throw error;
			}
			console.error('Error creating project:', error);
			return fail(500, { error: 'Failed to create project' });
		}
	}
};
