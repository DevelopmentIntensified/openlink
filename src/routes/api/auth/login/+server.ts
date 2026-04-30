import { auth } from '$lib/server/auth';
import { json } from '@sveltejs/kit';
import type { UserWithRoles } from '$lib/server/rbac';

export async function POST({ request }) {
	try {
		const body = await request.json();

		const result = await auth.api.signInEmail({
			body: {
				email: body.email,
				password: body.password
			}
		});

		if (!result || !result.user) {
			return json({ success: false, message: 'Invalid credentials' }, { status: 401 });
		}

		const user = result.user as UserWithRoles;
		const roles = user.roles || ['dev']; // default

		return json({
			success: true,
			user: {
				id: user.id,
				email: user.email,
				name: user.name
			},
			roles: roles
		});
	} catch (error) {
		console.error('Login error:', error);
		return json({ success: false, message: 'Login failed' }, { status: 500 });
	}
}
