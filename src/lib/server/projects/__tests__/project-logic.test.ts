import { describe, it, expect, beforeEach } from 'vitest';
import {
	createProject,
	getProjectById,
	updateProject,
	deleteProject,
	getProjectsByOwner,
	canManageProject,
	type CreateProjectInput,
	type UpdateProjectInput
} from '../project-logic';
import { projects } from '../project-logic';

describe('Project Logic', () => {
	beforeEach(() => {
		projects.clear();
	});

	describe('createProject', () => {
		it('should create a project with required fields', () => {
			const input: CreateProjectInput = {
				name: 'Test Project',
				ownerId: 'user-123',
				type: 'individual'
			};

			const result = createProject(input);

			expect(result.id).toBeDefined();
			expect(result.name).toBe('Test Project');
			expect(result.ownerId).toBe('user-123');
			expect(result.type).toBe('individual');
			expect(result.isBountyEnabled).toBe(false);
			expect(result.createdAt).toBeDefined();
		});

		it('should create a project with all optional fields', () => {
			const input: CreateProjectInput = {
				name: 'Full Project',
				description: 'A test project',
				repoUrl: 'https://github.com/test/project',
				website: 'https://project.test',
				category: 'web',
				ownerId: 'user-456',
				type: 'team',
				isBountyEnabled: true
			};

			const result = createProject(input);

			expect(result.name).toBe('Full Project');
			expect(result.description).toBe('A test project');
			expect(result.repoUrl).toBe('https://github.com/test/project');
			expect(result.website).toBe('https://project.test');
			expect(result.category).toBe('web');
			expect(result.type).toBe('team');
			expect(result.isBountyEnabled).toBe(true);
		});

		it('should generate unique IDs for each project', () => {
			const input: CreateProjectInput = {
				name: 'Project 1',
				ownerId: 'user-123',
				type: 'individual'
			};

			const project1 = createProject(input);
			const project2 = createProject({ ...input, name: 'Project 2' });

			expect(project1.id).not.toBe(project2.id);
		});
	});

	describe('getProjectById', () => {
		it('should return project when found', () => {
			const created = createProject({
				name: 'Find Me',
				ownerId: 'user-123',
				type: 'individual'
			});

			const found = getProjectById(created.id);
			expect(found).toEqual(created);
		});

		it('should return undefined when not found', () => {
			const found = getProjectById('non-existent-id');
			expect(found).toBeUndefined();
		});
	});

	describe('updateProject', () => {
		it('should update project fields', () => {
			const created = createProject({
				name: 'Original',
				ownerId: 'user-123',
				type: 'individual'
			});

			const updates: UpdateProjectInput = {
				name: 'Updated Name',
				description: 'New description'
			};

			const updated = updateProject(created.id, updates);

			expect(updated).toBeDefined();
			expect(updated?.name).toBe('Updated Name');
			expect(updated?.description).toBe('New description');
			expect(updated?.ownerId).toBe('user-123'); // unchanged
		});

		it('should return undefined when updating non-existent project', () => {
			const result = updateProject('non-existent', { name: 'New Name' });
			expect(result).toBeUndefined();
		});

		it('should update isBountyEnabled', () => {
			const created = createProject({
				name: 'Bounty Project',
				ownerId: 'user-123',
				type: 'individual'
			});

			const updated = updateProject(created.id, { isBountyEnabled: true });
			expect(updated?.isBountyEnabled).toBe(true);
		});
	});

	describe('deleteProject', () => {
		it('should delete project and return true', () => {
			const created = createProject({
				name: 'To Delete',
				ownerId: 'user-123',
				type: 'individual'
			});

			const result = deleteProject(created.id);
			expect(result).toBe(true);
			expect(getProjectById(created.id)).toBeUndefined();
		});

		it('should return false when deleting non-existent project', () => {
			const result = deleteProject('non-existent');
			expect(result).toBe(false);
		});
	});

	describe('getProjectsByOwner', () => {
		it('should return projects for a specific owner', () => {
			createProject({ name: 'Project 1', ownerId: 'user-123', type: 'individual' });
			createProject({ name: 'Project 2', ownerId: 'user-123', type: 'team' });
			createProject({ name: 'Project 3', ownerId: 'user-456', type: 'individual' });

			const user123Projects = getProjectsByOwner('user-123');
			expect(user123Projects).toHaveLength(2);
			expect(user123Projects[0].name).toBe('Project 1');
			expect(user123Projects[1].name).toBe('Project 2');
		});

		it('should return empty array when owner has no projects', () => {
			const projects = getProjectsByOwner('user-no-projects');
			expect(projects).toEqual([]);
		});
	});

	describe('canManageProject', () => {
		it('should return true for project owner', () => {
			const project = createProject({
				name: 'My Project',
				ownerId: 'owner-123',
				type: 'individual'
			});

			expect(canManageProject(project, 'owner-123')).toBe(true);
		});

		it('should return false for non-owner', () => {
			const project = createProject({
				name: 'My Project',
				ownerId: 'owner-123',
				type: 'individual'
			});

			expect(canManageProject(project, 'other-user')).toBe(false);
		});
	});
});
