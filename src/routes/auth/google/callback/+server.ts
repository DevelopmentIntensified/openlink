import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { google, authenticateUser, createUserSession } from '$lib/server/auth';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('oauth_state');
	const codeVerifier = cookies.get('code_verifier');

	if (!code || !state || !storedState || state !== storedState || !codeVerifier) {
		throw error(400, 'Invalid state');
	}

	cookies.delete('oauth_state', { path: '/' });
	cookies.delete('code_verifier', { path: '/' });

	const tokens = await google.validateAuthorizationCode(code, codeVerifier);
	const accessToken = tokens.accessToken();

	const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
	const googleUser = await userResponse.json();

	const user = await authenticateUser('google', googleUser.id, {
		username: googleUser.name || googleUser.email.split('@')[0],
		email: googleUser.email,
		avatarUrl: googleUser.picture
	});

	const session = await createUserSession(user.id);

	cookies.set('session', session.id, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 30
	});

	throw redirect(302, '/dashboard');
};
