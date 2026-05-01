/**
 * Client-safe utility for signup role detection.
 * Used by signup pages to determine role from route.
 */

export interface SignupData {
	email: string;
	password: string;
	name: string;
	role: string;
}

/**
 * Extract role from signup route path.
 * Deep implementation: parses route to determine if dev or sponsor signup.
 */
export function getSignupRole(route: string): string | null {
	if (route.startsWith('/dev/')) {
		return 'dev';
	}

	if (route.startsWith('/sponsor/')) {
		return 'sponsor';
	}

	return null;
}
