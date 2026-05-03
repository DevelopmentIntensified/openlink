import { bountyStatusEnum, type Bounty } from '../db/schema';

export interface CreateBountyInput {
	title: string;
	description?: string;
	amount: number; // in cents
	skills?: string[];
	priority?: (typeof bountyStatusEnum)[number];
	deadline?: number; // unix timestamp
	projectId: string;
	createdBy: string;
	status?: (typeof bountyStatusEnum)[number];
}

export interface SubmitBountyInput {
	submissionPR: string;
	notes?: string;
}

// In-memory store for demo purposes (replace with DB in production)
export const bounties = new Map<string, Bounty>();

export function createBounty(input: CreateBountyInput): Bounty {
	if (input.amount <= 0) {
		throw new Error('Amount must be positive');
	}

	const id = crypto.randomUUID();
	const now = new Date();

	const bounty: Bounty = {
		id,
		title: input.title,
		description: input.description || undefined,
		amount: input.amount,
		skills: input.skills || undefined,
		priority: input.priority || 'medium',
		deadline: input.deadline ? new Date(input.deadline) : undefined,
		status: input.status || 'open',
		projectId: input.projectId,
		createdBy: input.createdBy,
		assignedTo: undefined,
		submissionPR: undefined,
		submissionNotes: undefined,
		salableCheckoutId: undefined,
		salablePaymentId: undefined,
		createdAt: now
	};

	bounties.set(id, bounty);
	return bounty;
}

export function getBountyById(id: string): Bounty | undefined {
	return bounties.get(id);
}

export function listBounties(filters?: {
	status?: string;
	projectId?: string;
	assignedTo?: string;
}): Bounty[] {
	let result = Array.from(bounties.values());

	if (filters?.status) {
		result = result.filter((b) => b.status === filters.status);
	}

	if (filters?.projectId) {
		result = result.filter((b) => b.projectId === filters.projectId);
	}

	if (filters?.assignedTo) {
		result = result.filter((b) => b.assignedTo === filters.assignedTo);
	}

	return result;
}

export function claimBounty(id: string, developerId: string): Bounty | undefined {
	const bounty = bounties.get(id);
	if (!bounty) return undefined;

	if (bounty.assignedTo) {
		throw new Error('Bounty already claimed');
	}

	if (bounty.status !== 'open') {
		throw new Error('Cannot claim this bounty');
	}

	const updated: Bounty = {
		...bounty,
		status: 'in_progress',
		assignedTo: developerId
	};

	bounties.set(id, updated);
	return updated;
}

export function submitBounty(id: string, input: SubmitBountyInput): Bounty | undefined {
	const bounty = bounties.get(id);
	if (!bounty) throw new Error('Bounty not found');

	if (bounty.status !== 'in_progress') {
		throw new Error('Bounty must be claimed first');
	}

	const updated: Bounty = {
		...bounty,
		status: 'submitted',
		submissionPR: input.submissionPR,
		submissionNotes: input.notes || null
	};

	bounties.set(id, updated);
	return updated;
}

export function approveBounty(id: string): Bounty | undefined {
	const bounty = bounties.get(id);
	if (!bounty) return undefined;

	if (bounty.status !== 'submitted') {
		throw new Error('Bounty must be submitted first');
	}

	const updated: Bounty = {
		...bounty,
		status: 'paid',
		approvedAt: new Date()
	};

	bounties.set(id, updated);
	return updated;
}

export function rejectBounty(id: string): Bounty | undefined {
	const bounty = bounties.get(id);
	if (!bounty) return undefined;

	if (bounty.status !== 'submitted') {
		throw new Error('Bounty must be submitted first');
	}

	const updated: Bounty = {
		...bounty,
		status: 'in_progress',
		submissionPR: undefined,
		submissionNotes: undefined
	};

	bounties.set(id, updated);
	return updated;
}

export function calculatePlatformFee(amount: number): number {
	// 1% platform fee (sponsors only)
	return Math.round(amount * 0.01);
}
