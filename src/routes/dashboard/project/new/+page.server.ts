import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { projects } from '$lib/server/schema';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	return { user: locals.user };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
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

		await db.insert(projects).values({
			id: crypto.randomUUID(),
			name,
			description: description || null,
			repoUrl: repoUrl || null,
			website: website || null,
			ownerId: locals.user.id,
			type,
			isBountyEnabled
		});

		throw redirect(302, '/dashboard');
	}
};
