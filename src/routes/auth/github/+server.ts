import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { github } from '$lib/server/auth';
import { generateState } from 'arctic';

export const GET: RequestHandler = async ({ cookies }) => {
	const state = generateState();
	const scopes = ['read:user', 'user:email'];
	const url = await github.createAuthorizationURL(state, scopes);
	
	cookies.set('oauth_state', state, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 10
	});
	
	throw redirect(302, url.toString());
};
