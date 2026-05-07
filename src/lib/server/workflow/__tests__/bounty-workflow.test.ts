import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDb = vi.hoisted(() => ({
	insert: vi.fn(),
	select: vi.fn(),
	update: vi.fn(),
	delete: vi.fn()
}));

vi.mock('../../db', () => ({
	db: mockDb
}));

const mockSelectChain = (result: unknown[]) => ({
	from: vi.fn().mockReturnThis(),
	where: vi.fn().mockReturnThis(),
	limit: vi.fn().mockResolvedValue(result)
});

beforeEach(() => {
	vi.clearAllMocks();
	mockDb.update.mockReturnValue({
		set: vi.fn().mockReturnThis(),
		where: vi.fn().mockResolvedValue(undefined)
	});
});

describe('Bounty Workflow', () => {
	const openBounty = {
		id: 'bounty_1',
		projectId: 'proj_1',
		title: 'Test Bounty',
		status: 'open',
		assignedTo: null,
		submissionPR: null,
		submissionNotes: null,
		submissionDate: null,
		completedAt: null,
		paidAt: null
	};

	const inProgressBounty = {
		...openBounty,
		status: 'in_progress',
		assignedTo: 'user_dev'
	};

	const submittedBounty = {
		...inProgressBounty,
		status: 'submitted',
		submissionPR: 'https://github.com/pr/1',
		submissionNotes: 'Done'
	};

	describe('claimBounty', () => {
		it('should claim an open bounty', async () => {
			mockDb.select.mockReturnValue(mockSelectChain([openBounty]));
			mockDb.select.mockReturnValueOnce(mockSelectChain([openBounty]));
			mockDb.select.mockReturnValueOnce(mockSelectChain([{ ...openBounty, status: 'in_progress', assignedTo: 'user_dev' }]));

			const { claimBounty } = await import('../bounty-workflow');
			const result = await claimBounty({ bountyId: 'bounty_1', userId: 'user_dev' });

			expect(result.status).toBe('in_progress');
			expect(result.assignedTo).toBe('user_dev');
		});

		it('should reject claim on non-existent bounty', async () => {
			mockDb.select.mockReturnValue(mockSelectChain([]));

			const { claimBounty } = await import('../bounty-workflow');
			await expect(claimBounty({ bountyId: 'nonexistent', userId: 'user_dev' })).rejects.toThrow('Bounty not found');
		});

		it('should reject claim on non-open bounty', async () => {
			mockDb.select.mockReturnValue(mockSelectChain([inProgressBounty]));

			const { claimBounty } = await import('../bounty-workflow');
			await expect(claimBounty({ bountyId: 'bounty_1', userId: 'user_dev' })).rejects.toThrow('Bounty is not open for claims');
		});
	});

	describe('submitWork', () => {
		it('should submit work on in-progress bounty', async () => {
			mockDb.select.mockReturnValue(mockSelectChain([inProgressBounty]));
			mockDb.select.mockReturnValueOnce(mockSelectChain([inProgressBounty]));
			mockDb.select.mockReturnValueOnce(mockSelectChain([{ ...inProgressBounty, status: 'submitted', submissionPR: 'https://github.com/pr/1' }]));

			const { submitWork } = await import('../bounty-workflow');
			const result = await submitWork({ bountyId: 'bounty_1', prLink: 'https://github.com/pr/1', notes: 'Done' });

			expect(result.status).toBe('submitted');
		});

		it('should reject submission on non-existent bounty', async () => {
			mockDb.select.mockReturnValue(mockSelectChain([]));

			const { submitWork } = await import('../bounty-workflow');
			await expect(submitWork({ bountyId: 'nonexistent', prLink: 'https://github.com/pr/1' })).rejects.toThrow('Bounty not found');
		});

		it('should reject submission on non-in-progress bounty', async () => {
			mockDb.select.mockReturnValue(mockSelectChain([openBounty]));

			const { submitWork } = await import('../bounty-workflow');
			await expect(submitWork({ bountyId: 'bounty_1', prLink: 'https://github.com/pr/1' })).rejects.toThrow('Bounty is not in progress');
		});
	});

	describe('approveBounty', () => {
		it('should approve a submitted bounty', async () => {
			mockDb.select.mockReturnValue(mockSelectChain([submittedBounty]));
			mockDb.select.mockReturnValueOnce(mockSelectChain([submittedBounty]));
			mockDb.select.mockReturnValueOnce(mockSelectChain([{ ...submittedBounty, status: 'completed' }]));

			const { approveBounty } = await import('../bounty-workflow');
			const result = await approveBounty({ bountyId: 'bounty_1' });

			expect(result.status).toBe('completed');
		});

		it('should reject approval on non-submitted bounty', async () => {
			mockDb.select.mockReturnValue(mockSelectChain([openBounty]));

			const { approveBounty } = await import('../bounty-workflow');
			await expect(approveBounty({ bountyId: 'bounty_1' })).rejects.toThrow('Bounty is not submitted');
		});
	});

	describe('rejectBounty', () => {
		it('should reject and reopen a submitted bounty', async () => {
			mockDb.select.mockReturnValue(mockSelectChain([submittedBounty]));
			mockDb.select.mockReturnValueOnce(mockSelectChain([submittedBounty]));
			mockDb.select.mockReturnValueOnce(mockSelectChain([{ ...openBounty, status: 'open', assignedTo: null, submissionPR: null, submissionNotes: null, submissionDate: null }]));

			const { rejectBounty } = await import('../bounty-workflow');
			const result = await rejectBounty({ bountyId: 'bounty_1' });

			expect(result.status).toBe('open');
			expect(result.assignedTo).toBeNull();
			expect(result.submissionPR).toBeNull();
		});

		it('should reject rejection on non-submitted bounty', async () => {
			mockDb.select.mockReturnValue(mockSelectChain([openBounty]));

			const { rejectBounty } = await import('../bounty-workflow');
			await expect(rejectBounty({ bountyId: 'bounty_1' })).rejects.toThrow('Bounty is not submitted');
		});
	});
});
