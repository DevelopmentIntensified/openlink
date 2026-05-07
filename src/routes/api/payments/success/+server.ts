import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { bounties } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async (event) => {
	const url = event.url;
	const checkoutId = url.searchParams.get('checkoutId');
	const bountyId = url.searchParams.get('bountyId');
	
	if (!bountyId || !checkoutId) {
		throw redirect(302, '/explore');
	}
	
	try {
		await db.update(bounties).set({
			status: 'paid'
		}).where(eq(bounties.id, bountyId));
		
		throw redirect(303, `/project/-/bounty/${bountyId}?success=true`);
	} catch (error) {
		if (error instanceof Response) {
			throw error;
		}
		console.error('Payment success error:', error);
		throw redirect(303, `/project/-/bounty/${bountyId}?error=payment_failed`);
	}
};
