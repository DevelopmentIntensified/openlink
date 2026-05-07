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

describe('Bounties CRUD', () => {
	describe('createBounty', () => {
		it('should create a bounty with required fields', async () => {
			const { createBounty } = await import('../bounties');
			await createBounty({
				projectId: 'proj_1',
				title: 'Test Bounty',
				amount: 500,
				createdBy: 'user_123'
			});

			expect(mockDb.insert).toHaveBeenCalledOnce();
		});

		it('should generate a UUID for the bounty', async () => {
			const { createBounty } = await import('../bounties');
			const id = await createBounty({
				projectId: 'proj_1',
				title: 'Test',
				amount: 100,
				createdBy: 'user_123'
			});

			expect(id).toMatch(/^[0-9a-f-]{36}$/);
		});
	});

	describe('getBountyById', () => {
		it('should return bounty when found', async () => {
			const fakeBounty = { id: 'bounty_1', title: 'Test' };
			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnThis(),
				where: vi.fn().mockResolvedValue([fakeBounty])
			});

			const { getBountyById } = await import('../bounties');
			const result = await getBountyById('bounty_1');
			expect(result).toEqual(fakeBounty);
		});

		it('should return null when not found', async () => {
			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnThis(),
				where: vi.fn().mockResolvedValue([])
			});

			const { getBountyById } = await import('../bounties');
			const result = await getBountyById('nonexistent');
			expect(result).toBeNull();
		});
	});

	describe('claimBounty', () => {
		it('should claim and assign a bounty', async () => {
			const { claimBounty } = await import('../bounties');
			await claimBounty('bounty_1', 'user_dev');

			expect(mockDb.update).toHaveBeenCalledOnce();
		});
	});
});
