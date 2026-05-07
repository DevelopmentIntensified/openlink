import { pgTable, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user, session } from './auth.schema';

// Note: 'user' table is managed by Better Auth (see auth.schema.ts)
// Do NOT redefine it here - use Better Auth's schema.

export const projectTypeEnum = ['community', 'team', 'individual'] as const;
export const projectCategoryEnum = ['web', 'mobile', 'desktop', 'backend', 'devops', 'data', 'security', 'other'] as const;
export const bountyStatusEnum = ['open', 'in_progress', 'submitted', 'completed', 'paid'] as const;
export const bountyPriorityEnum = ['low', 'medium', 'high', 'urgent'] as const;

export const projects = pgTable("projects", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	repoUrl: text("repoUrl"),
	website: text("website"),
	category: text("category", { enum: projectCategoryEnum }).default('other'),
	ownerId: text("ownerId").notNull().references(() => user.id),
	type: text("type", { enum: projectTypeEnum }).notNull().default('individual'),
	isBountyEnabled: boolean("isBountyEnabled").notNull().default(false),
	createdAt: timestamp("createdAt").notNull()
});

export const bounties = pgTable("bounties", {
	id: text("id").primaryKey(),
	projectId: text("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
	title: text("title").notNull(),
	description: text("description"),
	skills: text("skills"),
	amount: integer("amount").notNull(),
	priority: text("priority", { enum: bountyPriorityEnum }).default('medium'),
	deadline: timestamp("deadline"),
	status: text("status", { enum: bountyStatusEnum }).notNull().default('open'),
	createdBy: text("createdBy").notNull().references(() => user.id),
	assignedTo: text("assignedTo").references(() => user.id),
	submissionPR: text("submissionPR"),
	submissionNotes: text("submissionNotes"),
	submissionDate: timestamp("submissionDate"),
	completedAt: timestamp("completedAt"),
	paidAt: timestamp("paidAt"),
	createdAt: timestamp("createdAt").notNull()
});

export const bountyContributions = pgTable("bounty_contributions", {
	id: text("id").primaryKey(),
	bountyId: text("bountyId").notNull().references(() => bounties.id, { onDelete: "cascade" }),
	userId: text("userId").notNull().references(() => user.id),
	amount: integer("amount").notNull(),
	stripePaymentId: text("stripePaymentId"),
	createdAt: timestamp("createdAt").notNull()
});

// DevTeams for project collaboration
export const devteams = pgTable("devteams", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	projectId: text("projectId").references(() => projects.id, { onDelete: "cascade" }),
	ownerId: text("ownerId").notNull().references(() => user.id),
	createdAt: timestamp("createdAt").notNull()
});

export const devteamMembers = pgTable("devteam_members", {
	id: text("id").primaryKey(),
	devteamId: text("devteamId").notNull().references(() => devteams.id, { onDelete: "cascade" }),
	userId: text("userId").notNull().references(() => user.id),
	joinedAt: timestamp("joinedAt").notNull()
});

// Relations - use 'user' (Better Auth's table, defined in auth.schema.ts)
export const usersRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	projects: many(projects),
	bounties: many(bounties),
	bountyContributions: many(bountyContributions)
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
	owner: one(user, {
		fields: [projects.ownerId],
		references: [user.id]
	}),
	bounties: many(bounties)
}));

export const bountiesRelations = relations(bounties, ({ one, many }) => ({
	project: one(projects, {
		fields: [bounties.projectId],
		references: [projects.id]
	}),
	createdBy: one(user, {
		fields: [bounties.createdBy],
		references: [user.id]
	}),
	assignedTo: one(user, {
		fields: [bounties.assignedTo],
		references: [user.id]
	}),
	contributions: many(bountyContributions)
}));

export const bountyContributionsRelations = relations(bountyContributions, ({ one }) => ({
	bounty: one(bounties, {
		fields: [bountyContributions.bountyId],
		references: [bounties.id]
	}),
	user: one(user, {
		fields: [bountyContributions.userId],
		references: [user.id]
	})
}));

export const devteamsRelations = relations(devteams, ({ one, many }) => ({
	owner: one(user, {
		fields: [devteams.ownerId],
		references: [user.id]
	}),
	project: one(projects, {
		fields: [devteams.projectId],
		references: [projects.id]
	}),
	members: many(devteamMembers)
}));

export const devteamMembersRelations = relations(devteamMembers, ({ one }) => ({
	devteam: one(devteams, {
		fields: [devteamMembers.devteamId],
		references: [devteams.id]
	}),
	user: one(user, {
		fields: [devteamMembers.userId],
		references: [user.id]
	})
}));

export * from './auth.schema';
