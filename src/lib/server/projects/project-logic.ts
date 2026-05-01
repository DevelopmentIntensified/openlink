import { projectTypeEnum, type Project } from '../db/schema';

export interface CreateProjectInput {
	name: string;
	description?: string;
	repoUrl?: string;
	website?: string;
	category?: (typeof projectTypeEnum)[number];
	ownerId: string;
	type: (typeof projectTypeEnum)[number];
	isBountyEnabled?: boolean;
}

export interface UpdateProjectInput {
	name?: string;
	description?: string;
	repoUrl?: string;
	website?: string;
	category?: (typeof projectTypeEnum)[number];
	type?: (typeof projectTypeEnum)[number];
	isBountyEnabled?: boolean;
}

// In-memory store for demo purposes (replace with DB in production)
export const projects = new Map<string, Project>();

export function createProject(input: CreateProjectInput): Project {
	const id = crypto.randomUUID();
	const now = new Date();

	const project: Project = {
		id,
		name: input.name,
		description: input.description || null,
		repoUrl: input.repoUrl || null,
		website: input.website || null,
		category: input.category || 'other',
		ownerId: input.ownerId,
		type: input.type,
		isBountyEnabled: input.isBountyEnabled ?? false,
		createdAt: now
	};

	projects.set(id, project);
	return project;
}

export function getProjectById(id: string): Project | undefined {
	return projects.get(id);
}

export function updateProject(id: string, updates: UpdateProjectInput): Project | undefined {
	const existing = projects.get(id);
	if (!existing) return undefined;

	const updated: Project = {
		...existing,
		...updates,
		description: updates.description ?? existing.description,
		repoUrl: updates.repoUrl ?? existing.repoUrl,
		website: updates.website ?? existing.website,
		category: updates.category ?? existing.category,
		type: updates.type ?? existing.type,
		isBountyEnabled: updates.isBountyEnabled ?? existing.isBountyEnabled
	};

	projects.set(id, updated);
	return updated;
}

export function deleteProject(id: string): boolean {
	return projects.delete(id);
}

export function getProjectsByOwner(ownerId: string): Project[] {
	return Array.from(projects.values()).filter((p) => p.ownerId === ownerId);
}

export function canManageProject(project: Project, userId: string): boolean {
	return project.ownerId === userId;
}
