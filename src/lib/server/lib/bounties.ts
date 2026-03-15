import { db } from '$lib/server/db';
import { bounties, projects, users } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function createBounty(data: {
	projectId: string;
	title: string;
	description?: string;
	skills?: string;
	amount: number;
	priority?: 'low' | 'medium' | 'high' | 'urgent';
	deadline?: Date;
	createdBy: string;
}) {
	const id = crypto.randomUUID();
	const now = new Date();
	
	await db.insert(bounties).values({
		id,
		projectId: data.projectId,
		title: data.title,
		description: data.description,
		skills: data.skills,
		amount: data.amount,
		priority: data.priority || 'medium',
		deadline: data.deadline,
		status: 'open',
		createdBy: data.createdBy,
		createdAt: now
	});
	
	return id;
}

export async function getBountyById(id: string) {
	const result = await db.select().from(bounties).where(eq(bounties.id, id));
	return result[0] || null;
}

export async function getBountiesByProject(projectId: string) {
	return db.select().from(bounties).where(eq(bounties.projectId, projectId)).orderBy(desc(bounties.createdAt));
}

export async function getBountiesByUser(userId: string) {
	return db.select().from(bounties).where(eq(bounties.createdBy, userId)).orderBy(desc(bounties.createdAt));
}

export async function getAllBounties(limit = 50, offset = 0) {
	return db.select().from(bounties).orderBy(desc(bounties.createdAt)).limit(limit).offset(offset);
}

export async function updateBounty(id: string, data: {
	title?: string;
	description?: string;
	skills?: string;
	amount?: number;
	priority?: 'low' | 'medium' | 'high' | 'urgent';
	deadline?: Date;
	status?: 'open' | 'in_progress' | 'submitted' | 'completed' | 'paid';
	assignedTo?: string;
	submissionPR?: string;
	submissionNotes?: string;
}) {
	const updateData: any = { ...data };
	await db.update(bounties).set(updateData).where(eq(bounties.id, id));
}

export async function deleteBounty(id: string) {
	await db.delete(bounties).where(eq(bounties.id, id));
}

export async function claimBounty(bountyId: string, userId: string) {
	await db.update(bounties).set({
		status: 'in_progress',
		assignedTo: userId
	}).where(eq(bounties.id, bountyId));
}

export async function submitBounty(bountyId: string, prLink: string, notes?: string) {
	await db.update(bounties).set({
		status: 'submitted',
		submissionPR: prLink,
		submissionNotes: notes
	}).where(eq(bounties.id, bountyId));
}

export async function completeBounty(bountyId: string) {
	await db.update(bounties).set({
		status: 'completed'
	}).where(eq(bounties.id, bountyId));
}

export async function markBountyPaid(bountyId: string) {
	await db.update(bounties).set({
		status: 'paid'
	}).where(eq(bounties.id, bountyId));
}

export async function getBountyWithProject(bountyId: string) {
	const bountyResult = await db.select().from(bounties).where(eq(bounties.id, bountyId));
	if (!bountyResult[0]) return null;
	
	const bounty = bountyResult[0];
	const project = await db.select().from(projects).where(eq(projects.id, bounty.projectId));
	const creator = await db.select({
		id: users.id,
		username: users.username,
		avatarUrl: users.avatarUrl
	}).from(users).where(eq(users.id, bounty.createdBy));
	
	let assignee = null;
	if (bounty.assignedTo) {
		const assigneeResult = await db.select({
			id: users.id,
			username: users.username,
			avatarUrl: users.avatarUrl
		}).from(users).where(eq(users.id, bounty.assignedTo));
		assignee = assigneeResult[0] || null;
	}
	
	return {
		...bounty,
		project: project[0] || null,
		creator: creator[0] || null,
		assignee
	};
}
