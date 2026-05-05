import { auth } from '$lib/server/auth';
import { json, redirect } from '@sveltejs/kit';
import type { UserWithRoles } from '$lib/server/rbac';

export async function POST({ request }) {
	try {
		const contentType = request.headers.get('content-type') || '';

		let email: string, password: string;
		
		// Check if form data or JSON
		if (contentType.includes('application/json')) {
			const body = await request.json();
			email = body.email;
			password = body.password;
		} else {
			const formData = await request.formData();
			email = formData.get('email')?.toString() || '';
			password = formData.get('password')?.toString() || '';
		}

		const result = await auth.api.signInEmail({
			body: {
				email,
				password
			}
		});

		if (!result || !result.user) {
			// If form submission, redirect back to login with error
			if (!contentType.includes('application/json')) {
				throw redirect(303, '/login?error=invalid_credentials');
			}
			return json({ success: false, message: 'Invalid credentials' }, { status: 401 });
		}

		const user = result.user as UserWithRoles;
		const roles = user.roles || ['dev'];

		// If form submission, redirect to dashboard
		if (!contentType.includes('application/json')) {
			throw redirect(303, '/dashboard');
		}

		return json({
			success: true,
			user: {
				id: user.id,
				email: user.email,
				name: user.name
			},
			roles
		});
	} catch (error) {
		console.error('Login error:', error);
		if (error && typeof error === 'object' && 'status' in error) {
			throw error; // Re-throw redirects
		}
		return json({ success: false, message: 'Login failed' }, { status: 500 });
	}
}
