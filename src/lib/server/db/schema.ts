import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const users = sqliteTable("users", {
	id: text("id").primaryKey(),
	username: text("username").notNull().unique(),
	email: text("email"),
	avatarUrl: text("avatarUrl"),
	bio: text("bio"),
	skills: text("skills"), // JSON array of skills
	provider: text("provider").notNull(), // 'github' or 'google'
	providerId: text("providerId").notNull(),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull()
});

export const sessions = sqliteTable("sessions", {
	id: text("id").primaryKey(),
	userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
	expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull()
});

export const projectTypeEnum = ['community', 'team', 'individual'] as const;
export const projectCategoryEnum = ['web', 'mobile', 'desktop', 'backend', 'devops', 'data', 'security', 'other'] as const;
export const bountyStatusEnum = ['open', 'in_progress', 'submitted', 'completed', 'paid'] as const;
export const bountyPriorityEnum = ['low', 'medium', 'high', 'urgent'] as const;

export const projects = sqliteTable("projects", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	repoUrl: text("repoUrl"),
	website: text("website"),
	category: text("category", { enum: projectCategoryEnum }).default('other'),
	ownerId: text("ownerId").notNull().references(() => users.id),
	type: text("type", { enum: projectTypeEnum }).notNull().default('individual'),
	isBountyEnabled: integer("isBountyEnabled", { mode: "boolean" }).notNull().default(false),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull()
});

export const bounties = sqliteTable("bounties", {
	id: text("id").primaryKey(),
	projectId: text("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
	title: text("title").notNull(),
	description: text("description"),
	skills: text("skills"), // JSON array of required skills
	amount: integer("amount").notNull(), // in cents
	priority: text("priority", { enum: bountyPriorityEnum }).default('medium'),
	deadline: integer("deadline", { mode: "timestamp" }), // optional deadline
	status: text("status", { enum: bountyStatusEnum }).notNull().default('open'),
	createdBy: text("createdBy").notNull().references(() => users.id),
	assignedTo: text("assignedTo").references(() => users.id),
	submissionPR: text("submissionPR"), // PR link from developer
	submissionNotes: text("submissionNotes"), // notes from developer
	salableCheckoutId: text("salableCheckoutId"),
	salablePaymentId: text("salablePaymentId"),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull()
});

export const bountyContributions = sqliteTable("bounty_contributions", {
	id: text("id").primaryKey(),
	bountyId: text("bountyId").notNull().references(() => bounties.id, { onDelete: "cascade" }),
	userId: text("userId").notNull().references(() => users.id),
	amount: integer("amount").notNull(), // in cents
	salablePaymentId: text("salablePaymentId"),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull()
});

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	projects: many(projects),
	bounties: many(bounties),
	bountyContributions: many(bountyContributions)
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
	owner: one(users, {
		fields: [projects.ownerId],
		references: [users.id]
	}),
	bounties: many(bounties)
}));

export const bountiesRelations = relations(bounties, ({ one, many }) => ({
	project: one(projects, {
		fields: [bounties.projectId],
		references: [projects.id]
	}),
	createdBy: one(users, {
		fields: [bounties.createdBy],
		references: [users.id]
	}),
	assignedTo: one(users, {
		fields: [bounties.assignedTo],
		references: [users.id]
	}),
	contributions: many(bountyContributions)
}));

export const bountyContributionsRelations = relations(bountyContributions, ({ one }) => ({
	bounty: one(bounties, {
		fields: [bountyContributions.bountyId],
		references: [bounties.id]
	}),
	user: one(users, {
		fields: [bountyContributions.userId],
		references: [users.id]
	})
}));

// DevTeams for project collaboration
export const devteams = sqliteTable("devteams", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	projectId: text("projectId").references(() => projects.id, { onDelete: "cascade" }),
	ownerId: text("ownerId").notNull().references(() => users.id),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull()
});

export const devteamMembers = sqliteTable("devteam_members", {
	id: text("id").primaryKey(),
	devteamId: text("devteamId").notNull().references(() => devteams.id, { onDelete: "cascade" }),
	userId: text("userId").notNull().references(() => users.id),
	joinedAt: integer("joinedAt", { mode: "timestamp" }).notNull()
});

export const devteamsRelations = relations(devteams, ({ one, many }) => ({
	owner: one(users, {
		fields: [devteams.ownerId],
		references: [users.id]
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
	user: one(users, {
		fields: [devteamMembers.userId],
		references: [users.id]
	})
}));

export * from './auth.schema';
