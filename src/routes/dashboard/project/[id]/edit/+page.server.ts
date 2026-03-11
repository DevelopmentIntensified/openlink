import { redirect, fail, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { projects } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const project = await db.query.projects.findFirst({
		where: eq(projects.id, params.id)
	});

	if (!project) {
		throw error(404, 'Project not found');
	}

	if (project.ownerId !== locals.user.id) {
		throw error(403, 'Not authorized');
	}

	return { project, user: locals.user };
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/login');
		}

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const description = formData.get('description') as string;
		const repoUrl = formData.get('repoUrl') as string;
		const website = formData.get('website') as string;
		const type = formData.get('type') as 'community' | 'team' | 'individual';
		const isBountyEnabled = formData.get('isBountyEnabled') === 'on';

		if (!name || !type) {
			return fail(400, { error: 'Name and type are required' });
		}

		await db.update(projects).set({
			name,
			description: description || null,
			repoUrl: repoUrl || null,
			website: website || null,
			type,
			isBountyEnabled
		}).where(eq(projects.id, params.id));

		throw redirect(302, '/dashboard');
	},
	delete: async ({ params, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/login');
		}

		const project = await db.query.projects.findFirst({
			where: eq(projects.id, params.id)
		});

		if (!project) {
			throw error(404, 'Project not found');
		}

		if (project.ownerId !== locals.user.id) {
			throw error(403, 'Not authorized');
		}

		await db.delete(projects).where(eq(projects.id, params.id));

		throw redirect(302, '/dashboard');
	}
};
