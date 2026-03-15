import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getBountyById } from '$lib/server/lib/bounties';
import { createCheckout } from '$lib/server/lib/payments';
import { env } from '$env/dynamic/private';

export const actions: Actions = {
	default: async (event) => {
		const bountyId = event.params.id;
		
		if (!bountyId) {
			return fail(400, { error: 'Bounty ID required' });
		}
		
		const bounty = await getBountyById(bountyId);
		
		if (!bounty) {
			return fail(404, { error: 'Bounty not found' });
		}
		
		try {
			const publicUrl = env.PUBLIC_URL || 'http://localhost:5173';
			
			const checkout = await createCheckout({
				amount: bounty.amount,
				productName: bounty.title,
				bountyId: bounty.id,
				successUrl: `${publicUrl}/api/payments/success?bountyId=${bountyId}`,
				cancelUrl: `${publicUrl}/api/payments/cancel?bountyId=${bountyId}`
			});
			
			throw redirect(303, checkout.url);
		} catch (error) {
			if (error instanceof Response && error.status === 303) {
				throw error;
			}
			console.error('Error creating checkout:', error);
			return fail(500, { error: 'Failed to create payment checkout' });
		}
	}
};
