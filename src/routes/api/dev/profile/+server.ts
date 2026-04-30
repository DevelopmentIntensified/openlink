import type { RequestHandler } from './$types';
import { handleProfileUpdate, type ProfileUpdateRequest } from '$lib/server/dev/api-logic';
import { json } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		if (!locals.user) {
			return json({ success: false, message: 'Authentication required' }, { status: 401 });
		}

		const body = await request.json();

		const data: ProfileUpdateRequest = {
			bio: body.bio,
			skills: body.skills,
			githubUrl: body.githubUrl
		};

		const result = await handleProfileUpdate(locals.user.id, data);

		return json(result);
	} catch (error) {
		console.error('Profile API error:', error);
		return json({ success: false, message: 'Internal server error' }, { status: 500 });
	}
};
