import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { devteams, devteamMembers } from '$lib/server/db/schema';
import { eq, inArray } from 'drizzle-orm';

export const load = async (event) => {
	const session = await event.locals.auth.api.getSession({ headers: event.request.headers });

	if (!session?.user) {
		throw redirect(302, '/login');
	}

	// Get teams owned by user
	const ownedTeams = await db
		.select()
		.from(devteams)
		.where(eq(devteams.ownerId, session.user.id));

	// Get team memberships
	const memberships = await db
		.select()
		.from(devteamMembers)
		.where(eq(devteamMembers.userId, session.user.id));

	const memberTeamIds = memberships.map(m => m.devteamId);

	// Get teams user is a member of
	const memberTeams = memberTeamIds.length > 0
		? await db.select().from(devteams).where(inArray(devteams.id, memberTeamIds))
		: [];

	// Combine and deduplicate
	const allTeams = [...ownedTeams, ...memberTeams];
	const uniqueTeams = allTeams.filter((team, index, self) =>
		index === self.findIndex(t => t.id === team.id)
	);

	// Get member counts for each team
	const teamsWithStats = await Promise.all(
		uniqueTeams.map(async (team) => {
			const members = await db
				.select()
				.from(devteamMembers)
				.where(eq(devteamMembers.devteamId, team.id));

			return {
				...team,
				stats: {
					memberCount: members.length,
					isOwner: team.ownerId === session.user.id
				}
			};
		})
	);

	return {
		user: session.user,
		teams: teamsWithStats
	};
};
