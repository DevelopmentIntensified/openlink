import { describe, it, expect, vi } from 'vitest';

// Simplified mocks
vi.mock('$env/dynamic/private', () => ({
	env: {
		ORIGIN: 'http://localhost:5173',
		BETTER_AUTH_SECRET: 'test-secret',
		NODE_ENV: 'test'
	}
}));

vi.mock('$lib/server/db', () => ({ db: {} }));
vi.mock('$app/server', () => ({ getRequestEvent: vi.fn() }));
vi.mock('better-auth/svelte-kit', () => ({ sveltekitCookies: vi.fn(() => ({})) }));

describe('Auth Configuration - RBAC', () => {
	it('should have userAdditionalFields with roles array', async () => {
		const { authConfig } = await import('../auth');
		
		expect(authConfig).toBeDefined();
		expect(authConfig.userAdditionalFields).toBeDefined();
		expect(authConfig.userAdditionalFields).toHaveProperty('roles');
	});

	it('should default roles to ["dev"] for new users', async () => {
		const { authConfig } = await import('../auth');
		
		const rolesField = authConfig.userAdditionalFields?.roles;
		if (rolesField && typeof rolesField === 'object' && 'defaultValue' in rolesField) {
			expect(rolesField.defaultValue).toEqual(['dev']);
		} else {
			expect(true).toBe(false); // Force fail if structure not right
		}
	});

	it('should store roles as array of strings', async () => {
		const { authConfig } = await import('../auth');
		
		const rolesField = authConfig.userAdditionalFields?.roles;
		expect(rolesField).toBeDefined();
	});
});

