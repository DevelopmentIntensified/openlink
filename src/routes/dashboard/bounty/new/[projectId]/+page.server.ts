import { redirect, fail, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { projects, bounties } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const project = await db.query.projects.findFirst({
		where: eq(projects.id, params.projectId)
	});

	if (!project) {
		throw error(404, 'Project not found');
	}

	if (!project.isBountyEnabled) {
		throw error(400, 'Bounties are not enabled for this project');
	}

	return { project, user: locals.user };
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/login');
		}

		const formData = await request.formData();
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const amountStr = formData.get('amount') as string;

		if (!title || !amountStr) {
			return fail(400, { error: 'Title and amount are required' });
		}

		const amount = Math.round(parseFloat(amountStr) * 100);
		if (isNaN(amount) || amount < 100) {
			return fail(400, { error: 'Amount must be at least $1.00' });
		}

		await db.insert(bounties).values({
			id: crypto.randomUUID(),
			projectId: params.projectId,
			title,
			description: description || null,
			amount,
			createdBy: locals.user.id,
			status: 'open'
		});

		throw redirect(302, `/project/${params.projectId}`);
	}
};
