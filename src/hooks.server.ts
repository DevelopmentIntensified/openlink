import type { Handle } from '@sveltejs/kit';
import { validateSessionToken } from '$lib/server/session';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('session');

	if (!sessionToken) {
		event.locals.user = null;
		return resolve(event);
	}

	const { session, user } = await validateSessionToken(sessionToken);

	if (!session || !user) {
		event.cookies.delete('session', { path: '/' });
		event.locals.user = null;
		return resolve(event);
	}

	event.locals.user = {
		id: user.id,
		username: user.username,
		email: user.email,
		avatarUrl: user.avatarUrl
	};

	return resolve(event);
};
