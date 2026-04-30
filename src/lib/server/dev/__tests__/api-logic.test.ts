import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleProfileUpdate, type ProfileUpdateRequest } from '../api-logic';

vi.mock('$lib/server/auth', () => ({
	auth: {
		api: {
			updateUser: vi.fn()
		}
	}
}));

describe('Dev Profile API Logic', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('handleProfileUpdate', () => {
		it('should update profile and set onboardingComplete on valid data', async () => {
			const { auth } = await import('$lib/server/auth');
			const mockUpdateUser = auth.api.updateUser as any;

			mockUpdateUser.mockResolvedValueOnce({ user: { id: '1', onboardingComplete: true } });

			const request: ProfileUpdateRequest = {
				bio: 'Full-stack dev',
				skills: ['JavaScript', 'Svelte'],
				githubUrl: 'https://github.com/dev123'
			};

			const result = await handleProfileUpdate('1', request);

			expect(mockUpdateUser).toHaveBeenCalledWith({
				body: {
					bio: 'Full-stack dev',
					skills: ['JavaScript', 'Svelte'],
					githubUrl: 'https://github.com/dev123',
					onboardingComplete: true
				}
			});
			expect(result.success).toBe(true);
		});

		it('should handle empty skills correctly', async () => {
			const { auth } = await import('$lib/server/auth');
			const mockUpdateUser = auth.api.updateUser as any;

			mockUpdateUser.mockResolvedValueOnce({ user: { id: '1' } });

			const request: ProfileUpdateRequest = {
				bio: 'Dev',
				skills: [],
				githubUrl: ''
			};

			await handleProfileUpdate('1', request);

			expect(mockUpdateUser).toHaveBeenCalledWith({
				body: {
					bio: 'Dev',
					onboardingComplete: true
				}
			});
		});

		it('should return error on update failure', async () => {
			const { auth } = await import('$lib/server/auth');
			const mockUpdateUser = auth.api.updateUser as any;

			mockUpdateUser.mockRejectedValueOnce(new Error('Update failed'));

			const request: ProfileUpdateRequest = {
				bio: 'Dev',
				skills: [],
				githubUrl: ''
			};

			const result = await handleProfileUpdate('1', request);

			expect(result.success).toBe(false);
			expect(result.message).toContain('Failed to update profile');
		});
	});
});
