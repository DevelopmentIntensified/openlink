import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '$lib/server/auth';
import { prepareSponsorProfileUpdate } from '$lib/server/sponsor/profile-logic';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/auth.schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user) {
			return json({ success: false, message: 'Unauthorized' }, { status: 401 });
		}

		// Check if user has sponsor role
		const userRoles = session.user.roles || [];
		if (!userRoles.includes('sponsor')) {
			return json({ success: false, message: 'Sponsor role required' }, { status: 403 });
		}

		const body = await request.json();
		const { companyName, companyWebsite, companyDescription } = body;

		// Validate and prepare update data
		const result = prepareSponsorProfileUpdate({
			companyName,
			companyWebsite,
			companyDescription
		});

		if (!result.success) {
			return json({ success: false, errors: result.errors }, { status: 400 });
		}

		// Update user profile
		await db
			.update(user)
			.set(result.data!)
			.where(eq(user.id, session.user.id));

		return json({ success: true, message: 'Profile updated successfully' });
	} catch (error) {
		console.error('Sponsor profile update error:', error);
		return json({ success: false, message: 'Internal server error' }, { status: 500 });
	}
};

export const GET: RequestHandler = async ({ request }) => {
	try {
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user) {
			return json({ success: false, message: 'Unauthorized' }, { status: 401 });
		}

		// Check if user has sponsor role
		const userRoles = session.user.roles || [];
		if (!userRoles.includes('sponsor')) {
			return json({ success: false, message: 'Sponsor role required' }, { status: 403 });
		}

		return json({
			success: true,
			user: {
				companyName: session.user.companyName,
				companyWebsite: session.user.companyWebsite,
				companyDescription: session.user.companyDescription,
				onboardingComplete: session.user.onboardingComplete
			}
		});
	} catch (error) {
		console.error('Sponsor profile fetch error:', error);
		return json({ success: false, message: 'Internal server error' }, { status: 500 });
	}
};
