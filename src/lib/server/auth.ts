import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';

export const authConfig = {
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	trustedOrigins:
		env.NODE_ENV === 'production'
			? [env.ORIGIN!, 'https://bountyforge.dev']
			: [env.ORIGIN!, 'http://localhost:5173', 'http://localhost:4173'],
	database: drizzleAdapter(db, { provider: 'sqlite' }),
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8,
		maxPasswordLength: 128
	},
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET
		},
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET
		}
	},
	emailVerification: {
		sendVerificationEmail: async ({ user, url, token }) => {
			console.log(`Send verification email to ${user.email}: ${url}`);
		},
		sendOnSignUp: true,
		expiresIn: 3600
	},
	rateLimit: {
		enabled: true,
		window: 60,
		max: 100,
		customRules: {
			'/login': { window: 15 * 60, max: 5 },
			'/signup': { window: 60 * 60, max: 3 },
			'/verify-email': { window: 60, max: 3 },
			'/callback/github': { window: 60, max: 10 },
			'/callback/google': { window: 60, max: 10 }
		}
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 24 hours
		cookieCache: {
			enabled: true,
			maxAge: 60 * 5, // 5 minutes
			strategy: 'compact'
		}
	},
	advanced: {
		ipAddress: {
			ipAddressHeaders: ['x-forwarded-for', 'x-real-ip', 'cf-connecting-ip']
		},
		useSecureCookies: env.NODE_ENV === 'production',
		disableCSRFCheck: false,
		disableOriginCheck: false,
		cookiePrefix: 'bountyforge'
	},
	plugins: [sveltekitCookies(getRequestEvent)],
	userAdditionalFields: {
		roles: {
			type: 'array',
			items: { type: 'string' },
			defaultValue: ['dev']
		},
		bio: {
			type: 'string',
			defaultValue: ''
		},
		skills: {
			type: 'array',
			items: { type: 'string' },
			defaultValue: []
		},
		githubUrl: {
			type: 'string',
			defaultValue: ''
		},
		onboardingComplete: {
			type: 'boolean',
			defaultValue: false
		},
		companyName: {
			type: 'string',
			defaultValue: ''
		},
		companyWebsite: {
			type: 'string',
			defaultValue: ''
		},
		companyDescription: {
			type: 'string',
			defaultValue: ''
		}
	}
};

export const auth = betterAuth(authConfig);
