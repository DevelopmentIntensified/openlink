import { describe, it, expect, beforeEach } from 'vitest';
import {
	createDevTeam,
	getDevTeamById,
	updateDevTeam,
	deleteDevTeam,
	addTeamMember,
	removeTeamMember,
	getUserTeams,
	canManageDevTeam,
	type CreateDevTeamInput,
	type UpdateDevTeamInput
} from '../devteam-logic';
import { devteams, devteamMembers } from '../devteam-logic';

describe('DevTeam Logic', () => {
	beforeEach(() => {
		devteams.clear();
		devteamMembers.clear();
	});

	describe('createDevTeam', () => {
		it('should create a devteam with required fields', () => {
			const input: CreateDevTeamInput = {
				name: 'Awesome Team',
				ownerId: 'user-123'
			};

			const result = createDevTeam(input);

			expect(result.id).toBeDefined();
			expect(result.name).toBe('Awesome Team');
			expect(result.ownerId).toBe('user-123');
			expect(result.projectId).toBeNull();
			expect(result.description).toBeNull();
			expect(result.createdAt).toBeDefined();
		});

		it('should create a devteam with project association', () => {
			const input: CreateDevTeamInput = {
				name: 'Project Team',
				description: 'Team for project X',
				ownerId: 'user-456',
				projectId: 'project-789'
			};

			const result = createDevTeam(input);

			expect(result.name).toBe('Project Team');
			expect(result.description).toBe('Team for project X');
			expect(result.projectId).toBe('project-789');
		});

		it('should generate unique IDs for each team', () => {
			const team1 = createDevTeam({ name: 'Team 1', ownerId: 'user-123' });
			const team2 = createDevTeam({ name: 'Team 2', ownerId: 'user-123' });

			expect(team1.id).not.toBe(team2.id);
		});
	});

	describe('getDevTeamById', () => {
		it('should return team when found', () => {
			const created = createDevTeam({ name: 'Find Me', ownerId: 'user-123' });

			const found = getDevTeamById(created.id);
			expect(found).toEqual(created);
		});

		it('should return undefined when not found', () => {
			const found = getDevTeamById('non-existent-id');
			expect(found).toBeUndefined();
		});
	});

	describe('updateDevTeam', () => {
		it('should update team fields', () => {
			const created = createDevTeam({ name: 'Original', ownerId: 'user-123' });

			const updates: UpdateDevTeamInput = {
				name: 'Updated Team',
				description: 'New description'
			};

			const updated = updateDevTeam(created.id, updates);

			expect(updated).toBeDefined();
			expect(updated?.name).toBe('Updated Team');
			expect(updated?.description).toBe('New description');
		});

		it('should return undefined when updating non-existent team', () => {
			const result = updateDevTeam('non-existent', { name: 'New Name' });
			expect(result).toBeUndefined();
		});
	});

	describe('deleteDevTeam', () => {
		it('should delete team and return true', () => {
			const created = createDevTeam({ name: 'To Delete', ownerId: 'user-123' });

			const result = deleteDevTeam(created.id);
			expect(result).toBe(true);
			expect(getDevTeamById(created.id)).toBeUndefined();
		});

		it('should return false when deleting non-existent team', () => {
			const result = deleteDevTeam('non-existent');
			expect(result).toBe(false);
		});
	});

	describe('addTeamMember', () => {
		it('should add a member to team', () => {
			const team = createDevTeam({ name: 'Test Team', ownerId: 'owner-123' });

			const member = addTeamMember(team.id, 'user-456');

			expect(member.devteamId).toBe(team.id);
			expect(member.userId).toBe('user-456');
			expect(member.joinedAt).toBeDefined();
		});

		it('should return undefined when adding to non-existent team', () => {
			const result = addTeamMember('non-existent', 'user-123');
			expect(result).toBeUndefined();
		});
	});

	describe('removeTeamMember', () => {
		it('should remove a member from team', () => {
			const team = createDevTeam({ name: 'Test Team', ownerId: 'owner-123' });
			const member = addTeamMember(team.id, 'user-456');

			const result = removeTeamMember(member.id);
			expect(result).toBe(true);
		});
	});

	describe('getUserTeams', () => {
		it('should return teams where user is owner or member', () => {
			const team1 = createDevTeam({ name: 'Team 1', ownerId: 'user-123' });
			const team2 = createDevTeam({ name: 'Team 2', ownerId: 'user-456' });
			addTeamMember(team2.id, 'user-123'); // user-123 is member of team2

			const user123Teams = getUserTeams('user-123');
			expect(user123Teams).toHaveLength(2);
		});
	});

	describe('canManageDevTeam', () => {
		it('should return true for team owner', () => {
			const team = createDevTeam({ name: 'My Team', ownerId: 'owner-123' });

			expect(canManageDevTeam(team, 'owner-123')).toBe(true);
		});

		it('should return false for non-owner', () => {
			const team = createDevTeam({ name: 'My Team', ownerId: 'owner-123' });

			expect(canManageDevTeam(team, 'other-user')).toBe(false);
		});
	});
});
