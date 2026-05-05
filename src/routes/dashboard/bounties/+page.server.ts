import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getBountiesByUser, getBountiesByProject, getAllBounties } from '$lib/server/lib/bounties';
import { getProjectsByOwner } from '$lib/server/lib/projects';

export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;

	if (!session) {
		throw redirect(302, '/login');
	}

	const userId = session.userId;

	// Get user role from session or database
	// For now, assume we can determine if user is a sponsor
	// In production, you'd check the user's role from the database

	// Get user's projects (to check if they're a sponsor)
	const userProjects = await getProjectsByOwner(userId);
	const isSponsor = userProjects.length > 0;

	let bounties;
	let stats;

	if (isSponsor) {
		// Sponsors see their own bounties (from their projects)
		const projectIds = userProjects.map((p) => p.id);
		bounties = await getAllBounties(100, 0); // Get all for now, filter in server
		// Filter bounties by sponsor's projects
		bounties = bounties.filter((b: any) => projectIds.includes(b.projectId));

		// Calculate stats
		stats = {
			total: bounties.length,
			open: bounties.filter((b: any) => b.status === 'open').length,
			in_progress: bounties.filter((b: any) => b.status === 'in_progress').length,
			submitted: bounties.filter((b: any) => b.status === 'submitted').length,
			completed: bounties.filter((b: any) => b.status === 'completed').length,
			paid: bounties.filter((b: any) => b.status === 'paid').length
		};
	} else {
		// Developers see all open bounties
		bounties = await getAllBounties(100, 0);
		bounties = bounties.filter((b: any) => b.status === 'open' || b.assignedTo === userId);

		// Calculate stats
		const allBounties = await getAllBounties(100, 0);
		stats = {
			total: allBounties.length,
			open: allBounties.filter((b: any) => b.status === 'open').length,
			in_progress: allBounties.filter((b: any) => b.status === 'in_progress').length,
			submitted: allBounties.filter((b: any) => b.status === 'submitted').length,
			completed: allBounties.filter((b: any) => b.status === 'completed').length,
			paid: allBounties.filter((b: any) => b.status === 'paid').length
		};
	}

	return {
		user: userId,
		bounties,
		stats,
		isSponsor
	};
};
