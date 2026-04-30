import { describe, it, expect } from 'vitest';
import {
	getOnboardingStatus,
	shouldShowOnboarding,
	prepareProfileUpdate,
	type ProfileData,
	type OnboardingStatus
} from '../profile-logic';

describe('Dev Profile Logic', () => {
	describe('getOnboardingStatus', () => {
		it('should return onboardingComplete as false for new user', () => {
			const user = {
				id: '1',
				roles: ['dev']
			};

			const status: OnboardingStatus = getOnboardingStatus(user);

			expect(status.onboardingComplete).toBe(false);
		});

		it('should return onboardingComplete as true for completed user', () => {
			const user = {
				id: '1',
				roles: ['dev'],
				onboardingComplete: true
			};

			const status: OnboardingStatus = getOnboardingStatus(user);

			expect(status.onboardingComplete).toBe(true);
		});

		it('should return false when onboardingComplete is undefined', () => {
			const user = {
				id: '1',
				roles: ['dev']
				// onboardingComplete not set
			};

			const status: OnboardingStatus = getOnboardingStatus(user);

			expect(status.onboardingComplete).toBe(false);
		});
	});

	describe('shouldShowOnboarding', () => {
		it('should return true when onboardingComplete is false', () => {
			const user = { onboardingComplete: false };
			expect(shouldShowOnboarding(user)).toBe(true);
		});

		it('should return false when onboardingComplete is true', () => {
			const user = { onboardingComplete: true };
			expect(shouldShowOnboarding(user)).toBe(false);
		});

		it('should return true when onboardingComplete is undefined', () => {
			const user = {};
			expect(shouldShowOnboarding(user)).toBe(true);
		});
	});

	describe('prepareProfileUpdate', () => {
		it('should prepare bio and skills update', () => {
			const data: ProfileData = {
				bio: 'Full-stack developer',
				skills: ['JavaScript', 'Svelte', 'Node.js'],
				githubUrl: 'https://github.com/dev123'
			};

			const update = prepareProfileUpdate(data);

			expect(update.bio).toBe('Full-stack developer');
			expect(update.skills).toEqual(['JavaScript', 'Svelte', 'Node.js']);
			expect(update.githubUrl).toBe('https://github.com/dev123');
			expect(update.onboardingComplete).toBe(true);
		});

		it('should handle empty skills array', () => {
			const data: ProfileData = {
				bio: 'Developer',
				skills: [],
				githubUrl: ''
			};

			const update = prepareProfileUpdate(data);

			expect(update.skills).toBeUndefined();
			expect(update.onboardingComplete).toBe(true);
		});

		it('should trim and filter empty skills', () => {
			const data: ProfileData = {
				bio: 'Dev',
				skills: ['JavaScript', '', '  Svelte  ', '  '],
				githubUrl: ''
			};

			const update = prepareProfileUpdate(data);

			expect(update.skills).toEqual(['JavaScript', 'Svelte']);
		});
	});
});
