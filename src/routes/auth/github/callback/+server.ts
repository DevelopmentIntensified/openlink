import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { github, authenticateUser, createUserSession } from '$lib/server/auth';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('oauth_state');

	if (!code || !state || !storedState || state !== storedState) {
		throw error(400, 'Invalid state');
	}

	cookies.delete('oauth_state', { path: '/' });

	const tokens = await github.validateAuthorizationCode(code);
	const accessToken = tokens.accessToken();

	const userResponse = await fetch('https://api.github.com/user', {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/vnd.github.v3+json'
		}
	});
	const githubUser = await userResponse.json();

	let email = githubUser.email;
	if (!email) {
		const emailsResponse = await fetch('https://api.github.com/user/emails', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/vnd.github.v3+json'
			}
		});
		const emails = await emailsResponse.json();
		const primaryEmail = emails.find((e: { primary: boolean }) => e.primary);
		email = primaryEmail?.email;
	}

	const user = await authenticateUser('github', String(githubUser.id), {
		username: githubUser.login,
		email,
		avatarUrl: githubUser.avatar_url
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
