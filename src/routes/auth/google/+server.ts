import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { google } from '$lib/server/auth';
import { generateState, generateCodeVerifier } from 'arctic';

export const GET: RequestHandler = async ({ cookies }) => {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const scopes = ['openid', 'email', 'profile'];
	const url = await google.createAuthorizationURL(state, codeVerifier, scopes);
	
	cookies.set('oauth_state', state, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 10
	});
	cookies.set('code_verifier', codeVerifier, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 10
	});
	
	throw redirect(302, url.toString());
};
