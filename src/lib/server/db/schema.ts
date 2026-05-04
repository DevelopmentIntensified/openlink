import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Note: 'user' table is managed by Better Auth (see auth.schema.ts)
// Do NOT redefine it here - use Better Auth's schema

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
	ownerId: text("ownerId").notNull().references(() => user.id),
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
	createdBy: text("createdBy").notNull().references(() => user.id),
	assignedTo: text("assignedTo").references(() => user.id),
	submissionPR: text("submissionPR"), // PR link from developer
	submissionNotes: text("submissionNotes"),
	submissionDate: integer("submissionDate", { mode: "timestamp" }),
	completedAt: integer("completedAt", { mode: "timestamp" }),
	paidAt: integer("paidAt", { mode: "timestamp" }),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull()
});

export const bountyContributions = sqliteTable("bounty_contributions", {
	id: text("id").primaryKey(),
	bountyId: text("bountyId").notNull().references(() => bounties.id, { onDelete: "cascade" }),
	userId: text("userId").notNull().references(() => user.id),
	amount: integer("amount").notNull(), // in cents
	stripePaymentId: text("stripePaymentId"),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull()
});

// DevTeams for project collaboration
export const devteams = sqliteTable("devteams", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	projectId: text("projectId").references(() => projects.id, { onDelete: "cascade" }),
	ownerId: text("ownerId").notNull().references(() => user.id),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull()
});

export const devteamMembers = sqliteTable("devteam_members", {
	id: text("id").primaryKey(),
	devteamId: text("devteamId").notNull().references(() => devteams.id, { onDelete: "cascade" }),
	userId: text("userId").notNull().references(() => user.id),
	joinedAt: integer("joinedAt", { mode: "timestamp" }).notNull()
});

// Relations - use 'user' (Better Auth's table)
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
