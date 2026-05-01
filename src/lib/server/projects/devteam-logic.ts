import { type Devteam, type DevteamMember } from '../db/schema';

export interface CreateDevTeamInput {
	name: string;
	description?: string;
	ownerId: string;
	projectId?: string;
}

export interface UpdateDevTeamInput {
	name?: string;
	description?: string;
	projectId?: string;
}

// In-memory stores (replace with DB in production)
export const devteams = new Map<string, Devteam>();
export const devteamMembers = new Map<string, DevteamMember>();

export function createDevTeam(input: CreateDevTeamInput): Devteam {
	const id = crypto.randomUUID();
	const now = new Date();

	const team: Devteam = {
		id,
		name: input.name,
		description: input.description || null,
		ownerId: input.ownerId,
		projectId: input.projectId || null,
		createdAt: now
	};

	devteams.set(id, team);

	// Add owner as first member
	addTeamMember(id, input.ownerId);

	return team;
}

export function getDevTeamById(id: string): Devteam | undefined {
	return devteams.get(id);
}

export function updateDevTeam(id: string, updates: UpdateDevTeamInput): Devteam | undefined {
	const existing = devteams.get(id);
	if (!existing) return undefined;

	const updated: Devteam = {
		...existing,
		...updates,
		description: updates.description ?? existing.description,
		projectId: updates.projectId ?? existing.projectId
	};

	devteams.set(id, updated);
	return updated;
}

export function deleteDevTeam(id: string): boolean {
	// Remove all team members first
	const members = getTeamMembers(id);
	members.forEach((m) => devteamMembers.delete(m.id));

	return devteams.delete(id);
}

export function addTeamMember(devteamId: string, userId: string): DevteamMember | undefined {
	const team = devteams.get(devteamId);
	if (!team) return undefined;

	const id = crypto.randomUUID();
	const now = new Date();

	const member: DevteamMember = {
		id,
		devteamId,
		userId,
		joinedAt: now
	};

	devteamMembers.set(id, member);
	return member;
}

export function removeTeamMember(memberId: string): boolean {
	return devteamMembers.delete(memberId);
}

export function getTeamMembers(devteamId: string): DevteamMember[] {
	return Array.from(devteamMembers.values()).filter((m) => m.devteamId === devteamId);
}

export function getUserTeams(userId: string): Devteam[] {
	const ownedTeams = Array.from(devteams.values()).filter((t) => t.ownerId === userId);

	const memberTeamIds = Array.from(devteamMembers.values())
		.filter((m) => m.userId === userId)
		.map((m) => m.devteamId);

	const memberTeams = Array.from(devteams.values()).filter((t) => memberTeamIds.includes(t.id));

	// Combine and deduplicate
	const allTeams = [...ownedTeams, ...memberTeams];
	const uniqueTeams = allTeams.filter((team, index, self) => self.findIndex((t) => t.id === team.id) === index);

	return uniqueTeams;
}

export function canManageDevTeam(team: Devteam, userId: string): boolean {
	return team.ownerId === userId;
}
