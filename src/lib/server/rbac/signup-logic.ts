import type { UserWithRoles } from './index';

export interface SignupData {
	email: string;
	password: string;
	name: string;
	role: string;
}

export interface ValidationResult {
	valid: boolean;
	errors: string[];
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

/**
 * Validate signup data before creating user.
 * Deep implementation: checks email format, password length, required fields.
 */
export function validateSignupData(data: SignupData): ValidationResult {
	const errors: string[] = [];

	// Email validation
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!data.email || !emailRegex.test(data.email)) {
		errors.push('Invalid email address');
	}

	// Password validation (matches auth.ts minPasswordLength: 8)
	if (!data.password || data.password.length < 8) {
		errors.push('Password must be at least 8 characters');
	}

	// Name validation
	if (!data.name || data.name.trim().length === 0) {
		errors.push('Name is required');
	}

	// Role validation
	if (!data.role || (data.role !== 'dev' && data.role !== 'sponsor')) {
		errors.push('Role is required');
	}

	return {
		valid: errors.length === 0,
		errors
	};
}

/**
 * Prepare user data with roles for Better Auth signup.
 * Deep implementation: formats data for userAdditionalFields.
 */
export function prepareUserData(data: SignupData): SignupData & { roles: string[] } {
	return {
		...data,
		roles: [data.role]
	};
}
