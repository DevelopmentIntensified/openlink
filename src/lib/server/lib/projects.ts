import { db } from '$lib/server/db';
import { projects, bounties, user } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function createProject(data: {
	name: string;
	description?: string;
	repoUrl?: string;
	website?: string;
	category?: string;
	type: 'community' | 'team' | 'individual';
	isBountyEnabled: boolean;
	ownerId: string;
}) {
	const id = crypto.randomUUID();
	const now = new Date();

	await db.insert(projects).values({
		id,
		name: data.name,
		description: data.description,
		repoUrl: data.repoUrl,
		website: data.website,
		category: (data.category || 'other') as any,
		type: data.type,
		isBountyEnabled: data.isBountyEnabled,
		ownerId: data.ownerId,
		createdAt: now
	});

	return id;
}

export async function getProjectById(id: string) {
	const result = await db.select().from(projects).where(eq(projects.id, id));
	return result[0] || null;
}

export async function getProjectsByOwner(ownerId: string) {
	return db
		.select()
		.from(projects)
		.where(eq(projects.ownerId, ownerId))
		.orderBy(desc(projects.createdAt));
}

export async function getAllProjects(limit = 50, offset = 0) {
	return db.select().from(projects).orderBy(desc(projects.createdAt)).limit(limit).offset(offset);
}

export async function updateProject(
	id: string,
	data: {
		name?: string;
		description?: string;
		repoUrl?: string;
		website?: string;
		category?: string;
		type?: 'community' | 'team' | 'individual';
		isBountyEnabled?: boolean;
	}
) {
	const updateData: any = { ...data };
	if (data.category) updateData.category = data.category;
	if (data.type) updateData.type = data.type;

	await db.update(projects).set(updateData).where(eq(projects.id, id));
}

export async function deleteProject(id: string) {
	await db.delete(projects).where(eq(projects.id, id));
}

export async function getProjectWithBounties(projectId: string) {
	const projectResult = await db.select().from(projects).where(eq(projects.id, projectId));
	if (!projectResult[0]) return null;

	const project = projectResult[0];
	const projectBounties = await db.select().from(bounties).where(eq(bounties.projectId, projectId));
	const ownerResult = await db
		.select({
			id: user.id,
			name: user.name,
			image: user.image,
			bio: user.bio
		})
		.from(user)
		.where(eq(user.id, project.ownerId));

	return {
		...project,
		bounties: projectBounties,
		owner: ownerResult[0] || null
	};
}

export async function getFeaturedProjects(limit = 6) {
	return db.select().from(projects).limit(limit).orderBy(desc(projects.createdAt));
}
