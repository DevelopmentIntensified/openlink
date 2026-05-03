import { describe, it, expect, beforeEach } from 'vitest';
import {
	createBounty,
	getBountyById,
	listBounties,
	claimBounty,
	submitBounty,
	approveBounty,
	rejectBounty,
	calculatePlatformFee,
	type CreateBountyInput,
	type SubmitBountyInput
} from '../bounty-logic';

describe('Bounty Logic', () => {
	beforeEach(() => {
		// Clear bounties store before each test
	});

	describe('createBounty', () => {
		it('should create a bounty with required fields', () => {
			const input: CreateBountyInput = {
				title: 'Fix login bug',
				description: 'Fix the authentication issue',
				amount: 50000, // $500.00 in cents
				projectId: 'project-123',
				createdBy: 'sponsor-123'
			};

			const result = createBounty(input);

			expect(result.id).toBeDefined();
			expect(result.title).toBe('Fix login bug');
			expect(result.description).toBe('Fix the authentication issue');
			expect(result.amount).toBe(50000);
			expect(result.projectId).toBe('project-123');
			expect(result.createdBy).toBe('sponsor-123');
			expect(result.status).toBe('open');
			expect(result.assignedTo).toBeUndefined();
			expect(result.createdAt).toBeDefined();
		});

		it('should create bounty with optional fields', () => {
			const deadline = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days from now
			const input: CreateBountyInput = {
				title: 'Implement feature',
				description: 'Add new dashboard',
				amount: 100000, // $1000.00
				skills: ['svelte', 'typescript'],
				priority: 'high',
				deadline,
				projectId: 'project-456',
				createdBy: 'sponsor-456'
			};

			const result = createBounty(input);

			expect(result.skills).toEqual(['svelte', 'typescript']);
			expect(result.priority).toBe('high');
			expect(result.deadline?.getTime()).toBe(deadline);
		});

		it('should generate unique IDs for each bounty', () => {
			const input: CreateBountyInput = {
				title: 'Bounty 1',
				amount: 10000,
				projectId: 'project-123',
				createdBy: 'sponsor-123'
			};

			const bounty1 = createBounty(input);
			const bounty2 = createBounty({ ...input, title: 'Bounty 2' });

			expect(bounty1.id).not.toBe(bounty2.id);
		});

		it('should reject negative amounts', () => {
			const input: CreateBountyInput = {
				title: 'Invalid Bounty',
				amount: -1000,
				projectId: 'project-123',
				createdBy: 'sponsor-123'
			};

			expect(() => createBounty(input)).toThrow('Amount must be positive');
		});

		it('should reject zero amount', () => {
			const input: CreateBountyInput = {
				title: 'Zero Bounty',
				amount: 0,
				projectId: 'project-123',
				createdBy: 'sponsor-123'
			};

			expect(() => createBounty(input)).toThrow('Amount must be positive');
		});
	});

	describe('getBountyById', () => {
		it('should return bounty when found', () => {
			const created = createBounty({
				title: 'Find Me',
				amount: 25000,
				projectId: 'project-123',
				createdBy: 'sponsor-123'
			});

			const found = getBountyById(created.id);
			expect(found).toEqual(created);
		});

		it('should return undefined when not found', () => {
			const found = getBountyById('non-existent-id');
			expect(found).toBeUndefined();
		});
	});

	describe('listBounties', () => {
		beforeEach(() => {
			// Create test bounties
			createBounty({
				title: 'Open Bounty 1',
				amount: 10000,
				projectId: 'project-123',
				createdBy: 'sponsor-123',
				status: 'open'
			});
			createBounty({
				title: 'Open Bounty 2',
				amount: 20000,
				projectId: 'project-123',
				createdBy: 'sponsor-123',
				status: 'open'
			});
			createBounty({
				title: 'Claimed Bounty',
				amount: 30000,
				projectId: 'project-456',
				createdBy: 'sponsor-456',
				status: 'in_progress'
			});
		});

		it('should return all bounties when no filter', () => {
			const bounties = listBounties();
			expect(bounties.length).toBeGreaterThanOrEqual(3);
		});

		it('should filter by status', () => {
			const openBounties = listBounties({ status: 'open' });
			expect(openBounties.length).toBeGreaterThanOrEqual(2);
			expect(openBounties.every((b) => b.status === 'open')).toBe(true);
		});

		it('should filter by projectId', () => {
			const projectBounties = listBounties({ projectId: 'project-123' });
			expect(projectBounties.length).toBeGreaterThanOrEqual(2);
			expect(projectBounties.every((b) => b.projectId === 'project-123')).toBe(true);
		});

		it('should filter by assignedTo', () => {
			// First claim a bounty
			const bounty = createBounty({
				title: 'To Claim',
				amount: 15000,
				projectId: 'project-123',
				createdBy: 'sponsor-123'
			});
			claimBounty(bounty.id, 'dev-123');

			const assignedBounties = listBounties({ assignedTo: 'dev-123' });
			expect(assignedBounties.length).toBeGreaterThanOrEqual(1);
			expect(assignedBounties[0].assignedTo).toBe('dev-123');
		});
	});

	describe('claimBounty', () => {
		it('should claim an open bounty', () => {
			const bounty = createBounty({
				title: 'Claimable',
				amount: 20000,
				projectId: 'project-123',
				createdBy: 'sponsor-123'
			});

			const result = claimBounty(bounty.id, 'dev-123');

			expect(result).toBeDefined();
			expect(result?.status).toBe('in_progress');
			expect(result?.assignedTo).toBe('dev-123');
		});

		it('should not claim non-existent bounty', () => {
			const result = claimBounty('non-existent', 'dev-123');
			expect(result).toBeUndefined();
		});

		it('should not claim already claimed bounty', () => {
			const bounty = createBounty({
				title: 'Already Claimed',
				amount: 20000,
				projectId: 'project-123',
				createdBy: 'sponsor-123'
			});

			claimBounty(bounty.id, 'dev-123');

			expect(() => claimBounty(bounty.id, 'dev-456')).toThrow('Bounty already claimed');
		});

		it('should not claim completed bounty', () => {
			const bounty = createBounty({
				title: 'Completed',
				amount: 20000,
				projectId: 'project-123',
				createdBy: 'sponsor-123'
			});

			claimBounty(bounty.id, 'dev-123');
			submitBounty(bounty.id, { submissionPR: 'https://github.com/pr/1', notes: 'Done' });
			approveBounty(bounty.id);

			expect(() => claimBounty(bounty.id, 'dev-456')).toThrow('Bounty already claimed');
		});
	});

	describe('submitBounty', () => {
		it('should submit work for claimed bounty', () => {
			const bounty = createBounty({
				title: 'Submit Work',
				amount: 30000,
				projectId: 'project-123',
				createdBy: 'sponsor-123'
			});

			claimBounty(bounty.id, 'dev-123');

			const submission: SubmitBountyInput = {
				submissionPR: 'https://github.com/pr/123',
				notes: 'Fixed the issue'
			};

			const result = submitBounty(bounty.id, submission);

			expect(result).toBeDefined();
			expect(result?.status).toBe('submitted');
			expect(result?.submissionPR).toBe('https://github.com/pr/123');
			expect(result?.submissionNotes).toBe('Fixed the issue');
		});

		it('should not submit non-existent bounty', () => {
			const submission: SubmitBountyInput = {
				submissionPR: 'https://github.com/pr/1',
				notes: 'Done'
			};

			expect(() => submitBounty('non-existent', submission)).toThrow('Bounty not found');
		});

		it('should not submit unclaimed bounty', () => {
			const bounty = createBounty({
				title: 'Unclaimed',
				amount: 20000,
				projectId: 'project-123',
				createdBy: 'sponsor-123'
			});

			const submission: SubmitBountyInput = {
				submissionPR: 'https://github.com/pr/1',
				notes: 'Done'
			};

			expect(() => submitBounty(bounty.id, submission)).toThrow('Bounty must be claimed first');
		});
	});

	describe('approveBounty', () => {
		it('should approve submitted bounty and calculate fee', () => {
			const bounty = createBounty({
				title: 'Approve Me',
				amount: 100000, // $1000.00
				projectId: 'project-123',
				createdBy: 'sponsor-123'
			});

			claimBounty(bounty.id, 'dev-123');
			submitBounty(bounty.id, { submissionPR: 'https://github.com/pr/1', notes: 'Done' });

			const result = approveBounty(bounty.id);

			expect(result).toBeDefined();
			expect(result?.status).toBe('paid');
			expect(result?.approvedAt).toBeDefined();
		});

		it('should not approve non-submitted bounty', () => {
			const bounty = createBounty({
				title: 'Not Submitted',
				amount: 20000,
				projectId: 'project-123',
				createdBy: 'sponsor-123'
			});

			expect(() => approveBounty(bounty.id)).toThrow('Bounty must be submitted first');
		});

		it('should calculate 1% platform fee correctly', () => {
			const amount = 100000; // $1000.00
			const fee = calculatePlatformFee(amount);
			expect(fee).toBe(1000); // $10.00 = 1% of $1000
		});

		it('should calculate fee for different amounts', () => {
			expect(calculatePlatformFee(50000)).toBe(500); // $500 -> $5 fee
			expect(calculatePlatformFee(250000)).toBe(2500); // $2500 -> $25 fee
		});
	});

	describe('rejectBounty', () => {
		it('should reject submitted bounty and return to claimed state', () => {
			const bounty = createBounty({
				title: 'Reject Me',
				amount: 50000,
				projectId: 'project-123',
				createdBy: 'sponsor-123'
			});

			claimBounty(bounty.id, 'dev-123');
			submitBounty(bounty.id, { submissionPR: 'https://github.com/pr/1', notes: 'Done' });

			const result = rejectBounty(bounty.id);

			expect(result).toBeDefined();
			expect(result?.status).toBe('in_progress');
			expect(result?.submissionPR).toBeUndefined();
			expect(result?.submissionNotes).toBeUndefined();
		});

		it('should not reject non-submitted bounty', () => {
			const bounty = createBounty({
				title: 'Open Bounty',
				amount: 20000,
				projectId: 'project-123',
				createdBy: 'sponsor-123'
			});

			expect(() => rejectBounty(bounty.id)).toThrow('Bounty must be submitted first');
		});
	});

	describe('calculatePlatformFee', () => {
		it('should return 1% of amount', () => {
			expect(calculatePlatformFee(100000)).toBe(1000); // $1000 -> $10
			expect(calculatePlatformFee(5000)).toBe(50); // $50 -> $0.50
		});

		it('should handle minimum amounts', () => {
			expect(calculatePlatformFee(100)).toBe(1); // $1 -> $0.01
		});

		it('should handle large amounts', () => {
			expect(calculatePlatformFee(1000000)).toBe(10000); // $10000 -> $100
		});
	});
});
