import { auth } from '$lib/server/auth';
import { validateSignupData, prepareUserData, type SignupData } from '$lib/server/rbac/signup-logic';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	try {
		const body = await request.json();

		const data: SignupData = {
			email: body.email,
			password: body.password,
			name: body.name,
			role: body.role
		};

		// Validate signup data using deep module
		const validation = validateSignupData(data);

		if (!validation.valid) {
			return json({ success: false, errors: validation.errors }, { status: 400 });
		}

		// Prepare user data with roles for Better Auth
		const userData = prepareUserData(data);

		// Create user with Better Auth
		const result = await auth.api.signUpEmail({
			body: {
				email: userData.email,
				password: userData.password,
				name: userData.name,
				roles: userData.roles
			}
		});

		return json({ success: true, user: result.user });
	} catch (error) {
		console.error('Signup error:', error);
		return json({ success: false, errors: ['Signup failed'] }, { status: 500 });
	}
}
