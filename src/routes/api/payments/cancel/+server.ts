import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const bountyId = event.url.searchParams.get('bountyId');
	
	if (!bountyId) {
		throw redirect(302, '/explore');
	}
	
	throw redirect(303, `/project/-/bounty/${bountyId}?cancelled=true`);
};
