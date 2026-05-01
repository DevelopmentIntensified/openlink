import { describe, it, expect } from 'vitest';
import {
	getSponsorOnboardingStatus,
	shouldShowSponsorOnboarding,
	prepareSponsorProfileUpdate,
	type SponsorProfileData
} from '../profile-logic';

describe('Sponsor Profile Logic', () => {
	describe('getSponsorOnboardingStatus', () => {
		it('should return onboardingComplete: false for sponsor without company name', () => {
			const user = {
				id: '1',
				name: 'Test Sponsor',
				email: 'sponsor@test.com',
				roles: ['sponsor'],
				companyName: null,
				companyWebsite: null,
				onboardingComplete: false
			};

			const status = getSponsorOnboardingStatus(user);

			expect(status.onboardingComplete).toBe(false);
			expect(status.needsCompanyInfo).toBe(true);
		});

		it('should return onboardingComplete: true when all fields filled', () => {
			const user = {
				id: '1',
				name: 'Test Sponsor',
				email: 'sponsor@test.com',
				roles: ['sponsor'],
				companyName: 'Test Corp',
				companyWebsite: 'https://test.com',
				onboardingComplete: true
			};

			const status = getSponsorOnboardingStatus(user);

			expect(status.onboardingComplete).toBe(true);
			expect(status.needsCompanyInfo).toBe(false);
		});
	});

	describe('shouldShowSponsorOnboarding', () => {
		it('should return true when onboarding not complete', () => {
			const user = {
				id: '1',
				name: 'Test Sponsor',
				email: 'sponsor@test.com',
				roles: ['sponsor'],
				onboardingComplete: false
			};

			expect(shouldShowSponsorOnboarding(user)).toBe(true);
		});

		it('should return false when onboarding complete', () => {
			const user = {
				id: '1',
				name: 'Test Sponsor',
				email: 'sponsor@test.com',
				roles: ['sponsor'],
				onboardingComplete: true
			};

			expect(shouldShowSponsorOnboarding(user)).toBe(false);
		});
	});

	describe('prepareSponsorProfileUpdate', () => {
		it('should prepare valid profile update data', () => {
			const data: SponsorProfileData = {
				companyName: 'Test Corp',
				companyWebsite: 'https://test.com',
				companyDescription: 'A test company'
			};

			const result = prepareSponsorProfileUpdate(data);

			expect(result.success).toBe(true);
			expect(result.data).toEqual({
				companyName: 'Test Corp',
				companyWebsite: 'https://test.com',
				companyDescription: 'A test company',
				onboardingComplete: true
			});
		});

		it('should validate required company name', () => {
			const data: SponsorProfileData = {
				companyName: '',
				companyWebsite: 'https://test.com',
				companyDescription: 'A test company'
			};

			const result = prepareSponsorProfileUpdate(data);

			expect(result.success).toBe(false);
			expect(result.errors).toContain('Company name is required');
		});

		it('should validate website URL format', () => {
			const data: SponsorProfileData = {
				companyName: 'Test Corp',
				companyWebsite: 'invalid-url',
				companyDescription: 'A test company'
			};

			const result = prepareSponsorProfileUpdate(data);

			expect(result.success).toBe(false);
			expect(result.errors).toContain('Invalid website URL');
		});

		it('should allow empty website (optional field)', () => {
			const data: SponsorProfileData = {
				companyName: 'Test Corp',
				companyWebsite: '',
				companyDescription: 'A test company'
			};

			const result = prepareSponsorProfileUpdate(data);

			expect(result.success).toBe(true);
		});

		it('should set onboardingComplete to true when all required fields provided', () => {
			const data: SponsorProfileData = {
				companyName: 'Test Corp',
				companyWebsite: 'https://test.com',
				companyDescription: 'A test company'
			};

			const result = prepareSponsorProfileUpdate(data);

			expect(result.success).toBe(true);
			expect(result.data?.onboardingComplete).toBe(true);
		});
	});
});
