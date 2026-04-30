import { auth } from '$lib/server/auth';
import { prepareProfileUpdate, type ProfileData } from './profile-logic';

export interface ProfileUpdateRequest extends ProfileData {}

export interface ProfileUpdateResponse {
	success: boolean;
	message?: string;
	user?: any;
}

/**
 * Handle profile update API logic
 * Deep implementation: calls Better Auth updateUser with prepared data
 */
export async function handleProfileUpdate(
	userId: string,
	data: ProfileUpdateRequest
): Promise<ProfileUpdateResponse> {
	try {
		const updateData = prepareProfileUpdate(data);

		const result = await auth.api.updateUser({
			body: updateData
		});

		if (!result.user) {
			return { success: false, message: 'Failed to update profile' };
		}

		return { success: true, user: result.user };
	} catch (error) {
		console.error('Profile update error:', error);
		return { success: false, message: 'Failed to update profile' };
	}
}
