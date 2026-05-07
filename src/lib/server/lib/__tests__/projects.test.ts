import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDb = vi.hoisted(() => ({
	insert: vi.fn(),
	select: vi.fn(),
	update: vi.fn(),
	delete: vi.fn()
}));

vi.mock('$lib/server/db', () => ({ db: mockDb }));

beforeEach(() => {
	vi.clearAllMocks();
	mockDb.select.mockReturnValue({
		from: vi.fn().mockReturnThis(),
		where: vi.fn().mockReturnThis(),
		orderBy: vi.fn().mockReturnThis(),
		limit: vi.fn().mockReturnThis(),
		offset: vi.fn().mockReturnThis()
	});
	mockDb.insert.mockReturnValue({
		values: vi.fn().mockResolvedValue(undefined)
	});
	mockDb.update.mockReturnValue({
		set: vi.fn().mockReturnThis(),
		where: vi.fn().mockResolvedValue(undefined)
	});
	mockDb.delete.mockReturnValue({
		where: vi.fn().mockResolvedValue(undefined)
	});
});

describe('Projects CRUD', () => {
	describe('createProject', () => {
		it('should create a project with required fields', async () => {
			const { createProject } = await import('../projects');
			await createProject({
				name: 'Test Project',
				type: 'individual',
				isBountyEnabled: false,
				ownerId: 'user_123'
			});

			expect(mockDb.insert).toHaveBeenCalledOnce();
		});

		it('should generate a UUID for the project', async () => {
			const { createProject } = await import('../projects');
			const id = await createProject({
				name: 'Test',
				type: 'individual',
				isBountyEnabled: false,
				ownerId: 'user_123'
			});

			expect(id).toMatch(/^[0-9a-f-]{36}$/);
		});
	});

	describe('getProjectById', () => {
		it('should return project when found', async () => {
			const fakeProject = { id: 'proj_1', name: 'Test' };
			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnThis(),
				where: vi.fn().mockResolvedValue([fakeProject])
			});

			const { getProjectById } = await import('../projects');
			const result = await getProjectById('proj_1');
			expect(result).toEqual(fakeProject);
		});

		it('should return null when not found', async () => {
			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnThis(),
				where: vi.fn().mockResolvedValue([])
			});

			const { getProjectById } = await import('../projects');
			const result = await getProjectById('nonexistent');
			expect(result).toBeNull();
		});
	});

	describe('deleteProject', () => {
		it('should delete project by id', async () => {
			const { deleteProject } = await import('../projects');
			await deleteProject('proj_1');

			expect(mockDb.delete).toHaveBeenCalledOnce();
		});
	});
});
