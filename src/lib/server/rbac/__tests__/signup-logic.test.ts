import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSignupRole, validateSignupData, type SignupData } from '../signup-logic';

describe('Signup Logic - RBAC', () => {
	describe('getSignupRole', () => {
		it('should return "dev" for /dev/signup route', () => {
			const role = getSignupRole('/dev/signup');

			expect(role).toBe('dev');
		});

		it('should return "sponsor" for /sponsor/signup route', () => {
			const role = getSignupRole('/sponsor/signup');

			expect(role).toBe('sponsor');
		});

		it('should return null for non-role route', () => {
			const role = getSignupRole('/auth/signup');

			expect(role).toBeNull();
		});

		it('should handle nested dev routes', () => {
			const role = getSignupRole('/dev/signup?redirect=/dev/dashboard');

			expect(role).toBe('dev');
		});

		it('should handle nested sponsor routes', () => {
			const role = getSignupRole('/sponsor/signup?plan=premium');

			expect(role).toBe('sponsor');
		});
	});

	describe('validateSignupData', () => {
		it('should accept valid signup data with role', () => {
			const data: SignupData = {
				email: 'test@example.com',
				password: 'password123',
				name: 'Test User',
				role: 'dev'
			};

			const result = validateSignupData(data);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should reject short password', () => {
			const data: SignupData = {
				email: 'test@example.com',
				password: 'short',
				name: 'Test User',
				role: 'dev'
			};

			const result = validateSignupData(data);

			expect(result.valid).toBe(false);
			expect(result.errors).toContain('Password must be at least 8 characters');
		});

		it('should reject invalid email', () => {
			const data: SignupData = {
				email: 'invalid-email',
				password: 'password123',
				name: 'Test User',
				role: 'sponsor'
			};

			const result = validateSignupData(data);

			expect(result.valid).toBe(false);
			expect(result.errors).toContain('Invalid email address');
		});

		it('should reject missing role', () => {
			const data: SignupData = {
				email: 'test@example.com',
				password: 'password123',
				name: 'Test User',
				role: ''
			};

			const result = validateSignupData(data);

			expect(result.valid).toBe(false);
			expect(result.errors).toContain('Role is required');
		});

		it('should accept valid sponsor signup', () => {
			const data: SignupData = {
				email: 'sponsor@company.com',
				password: 'securepassword123',
				name: 'Company Sponsor',
				role: 'sponsor'
			};

			const result = validateSignupData(data);

			expect(result.valid).toBe(true);
		});
	});
});
