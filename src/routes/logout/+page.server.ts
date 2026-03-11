import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { invalidateSession } from '$lib/server/session';

export const load: PageServerLoad = async () => {
	throw redirect(302, '/');
};

export const actions: Actions = {
	default: async ({ cookies }) => {
		const sessionId = cookies.get('session');
		if (sessionId) {
			await invalidateSession(sessionId);
		}
		cookies.delete('session', { path: '/' });
		throw redirect(302, '/');
	}
};
