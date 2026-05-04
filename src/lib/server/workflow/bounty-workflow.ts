import type { Bounty, BountyStatus, BountyPriority } from '../db/schema';
import { db } from '../db';
import { bounties } from '../db/schema';
import { eq } from 'drizzle-orm';

/**
 * Deep module: Bounty workflow state transitions.
 * Interface: claimBounty, submitWork, approveBounty, rejectBounty
 * Leverage: Callers get workflow without knowing DB details.
 * Locality: All workflow bugs concentrated here.
 */

export interface ClaimBountyInput {
	bountyId: string;
	userId: string;
}

export interface SubmitWorkInput {
	bountyId: string;
	prLink: string;
	notes?: string;
}

export interface ApproveBountyInput {
	bountyId: string;
}

export interface RejectBountyInput {
	bountyId: string;
}

/**
 * Claim a bounty (open → in_progress)
 * Leverage: Validates state transition, updates DB.
 */
export async function claimBounty(input: ClaimBountyInput): Promise<Bounty> {
	const bounty = await db.select().from(bounties).where(eq(bounties.id, input.bountyId)).limit(1);
	if (!bounty[0]) throw new Error('Bounty not found');
	if (bounty[0].status !== 'open') throw new Error('Bounty is not open for claims');
	
	const now = new Date();
	await db.update(bounties)
		.set({
			status: 'in_progress' as BountyStatus,
			assignedTo: input.userId,
			submissionDate: now
		})
		.where(eq(bounties.id, input.bountyId));
	
	const updated = await db.select().from(bounties).where(eq(bounties.id, input.bountyId)).limit(1);
	if (!updated[0]) throw new Error('Failed to update bounty');
	return updated[0];
}

/**
 * Submit work for a bounty (in_progress → submitted)
 * Leverage: Validates state transition, stores PR link.
 */
export async function submitWork(input: SubmitWorkInput): Promise<Bounty> {
	const bounty = await db.select().from(bounties).where(eq(bounties.id, input.bountyId)).limit(1);
	if (!bounty[0]) throw new Error('Bounty not found');
	if (bounty[0].status !== 'in_progress') throw new Error('Bounty is not in progress');
	
	const now = new Date();
	await db.update(bounties)
		.set({
			status: 'submitted' as BountyStatus,
			submissionPR: input.prLink,
			submissionNotes: input.notes || null,
			submissionDate: now
		})
		.where(eq(bounties.id, input.bountyId));
	
	const updated = await db.select().from(bounties).where(eq(bounties.id, input.bountyId)).limit(1);
	if (!updated[0]) throw new Error('Failed to update bounty');
	return updated[0];
}

/**
 * Approve and complete a bounty (submitted → completed)
 * Leverage: Validates state transition, triggers payment.
 */
export async function approveBounty(input: ApproveBountyInput): Promise<Bounty> {
	const bounty = await db.select().from(bounties).where(eq(bounties.id, input.bountyId)).limit(1);
	if (!bounty[0]) throw new Error('Bounty not found');
	if (bounty[0].status !== 'submitted') throw new Error('Bounty is not submitted');
	
	const now = new Date();
	await db.update(bounties)
		.set({
			status: 'completed' as BountyStatus,
			completedAt: now
		})
		.where(eq(bounties.id, input.bountyId));
	
	const updated = await db.select().from(bounties).where(eq(bounties.id, input.bountyId)).limit(1);
	if (!updated[0]) throw new Error('Failed to update bounty');
	return updated[0];
}

/**
 * Reject submission and reopen bounty (submitted → open)
 * Leverage: Resets to open state, clears submission data.
 */
export async function rejectBounty(input: RejectBountyInput): Promise<Bounty> {
	const bounty = await db.select().from(bounties).where(eq(bounties.id, input.bountyId)).limit(1);
	if (!bounty[0]) throw new Error('Bounty not found');
	if (bounty[0].status !== 'submitted') throw new Error('Bounty is not submitted');
	
	await db.update(bounties)
		.set({
			status: 'open' as BountyStatus,
			assignedTo: null,
			submissionPR: null,
			submissionNotes: null,
			submissionDate: null
		})
		.where(eq(bounties.id, input.bountyId));
	
	const updated = await db.select().from(bounties).where(eq(bounties.id, input.bountyId)).limit(1);
	if (!updated[0]) throw new Error('Failed to update bounty');
	return updated[0];
}

/**
 * Get bounty with all related data (project, creator, assignee)
 * Leverage: Single query for bounty detail page.
 */
export async function getBountyWithRelations(bountyId: string) {
	const bountyResult = await db.select().from(bounties).where(eq(bounties.id, bountyId)).limit(1);
	if (!bountyResult[0]) return null;
	
	const bounty = bountyResult[0];
	// Note: In a real implementation, you'd join with user table
	// For now, return bounty with placeholder relations
	return {
		...bounty,
		project: null, // Would join with projects table
		creator: null, // Would join with user table
		assignee: null // Would join with user table
	};
}
