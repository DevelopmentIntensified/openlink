import type { UserWithRoles } from '$lib/server/rbac';

export interface SponsorProfileData {
	companyName: string;
	companyWebsite?: string;
	companyDescription?: string;
}

export interface SponsorOnboardingStatus {
	onboardingComplete: boolean;
	needsCompanyInfo: boolean;
}

export interface PrepareProfileResult {
	success: boolean;
	errors: string[];
	data?: Partial<SponsorProfileData & { onboardingComplete: boolean }>;
}

/**
 * Deep implementation: Determine sponsor onboarding status.
 * Checks if sponsor has completed their profile setup.
 */
export function getSponsorOnboardingStatus(user: UserWithRoles): SponsorOnboardingStatus {
	const hasCompanyName = user.companyName && user.companyName.trim().length > 0;
	const hasCompanyWebsite = user.companyWebsite && user.companyWebsite.trim().length > 0;

	const onboardingComplete = user.onboardingComplete === true;
	const needsCompanyInfo = !hasCompanyName || !hasCompanyWebsite;

	return {
		onboardingComplete,
		needsCompanyInfo
	};
}

/**
 * Deep implementation: Check if sponsor onboarding should be shown.
 * Returns true if user hasn't completed onboarding.
 */
export function shouldShowSponsorOnboarding(user: UserWithRoles): boolean {
	const status = getSponsorOnboardingStatus(user);
	return !status.onboardingComplete;
}

/**
 * Deep implementation: Validate and prepare sponsor profile update data.
 * Returns structured result with success flag and errors array.
 */
export function prepareSponsorProfileUpdate(data: SponsorProfileData): PrepareProfileResult {
	const errors: string[] = [];

	// Validate company name (required)
	if (!data.companyName || data.companyName.trim().length === 0) {
		errors.push('Company name is required');
	}

	// Validate website URL format (optional but must be valid if provided)
	if (data.companyWebsite && data.companyWebsite.trim().length > 0) {
		try {
			new URL(data.companyWebsite);
		} catch {
			errors.push('Invalid website URL');
		}
	}

	if (errors.length > 0) {
		return { success: false, errors };
	}

	// Prepare update data
	const updateData: Partial<SponsorProfileData & { onboardingComplete: boolean }> = {
		companyName: data.companyName.trim(),
		companyWebsite: data.companyWebsite?.trim() || null,
		companyDescription: data.companyDescription?.trim() || null
	};

	// Mark onboarding as complete if required fields are filled
	if (data.companyName && data.companyName.trim().length > 0) {
		updateData.onboardingComplete = true;
	}

	return { success: true, errors: [], data: updateData };
}
