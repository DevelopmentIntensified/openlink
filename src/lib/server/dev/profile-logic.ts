import type { UserWithRoles } from '$lib/server/rbac';

export interface ProfileData {
	bio?: string;
	skills?: string[];
	githubUrl?: string;
}

export interface OnboardingStatus {
	onboardingComplete: boolean;
}

export interface ProfileUpdate {
	bio?: string;
	skills?: string[];
	githubUrl?: string;
	onboardingComplete?: boolean;
}

/**
 * Get onboarding status from user
 * Deep implementation: checks onboardingComplete field with defaults
 */
export function getOnboardingStatus(user: any): OnboardingStatus {
	return {
		onboardingComplete: user?.onboardingComplete || false
	};
}

/**
 * Check if onboarding modal should be shown
 * Deep implementation: show if not completed
 */
export function shouldShowOnboarding(user: any): boolean {
	const status = getOnboardingStatus(user);
	return !status.onboardingComplete;
}

/**
 * Prepare profile update data for Better Auth
 * Deep implementation: transforms form data to Better Auth update format
 * Sets onboardingComplete to true on save
 */
export function prepareProfileUpdate(data: ProfileData): ProfileUpdate {
	const skills = data.skills
		? data.skills.map((s) => s.trim()).filter((s) => s.length > 0)
		: undefined;

	const result: ProfileUpdate = {
		onboardingComplete: true
	};

	if (data.bio?.trim()) {
		result.bio = data.bio.trim();
	}

	if (skills && skills.length > 0) {
		result.skills = skills;
	}

	if (data.githubUrl?.trim()) {
		result.githubUrl = data.githubUrl.trim();
	}

	return result;
}
