import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	email: text('email'),
	avatarUrl: text('avatar_url'),
	provider: text('provider').notNull(),
	providerId: text('provider_id').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
});

export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => users.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const projects = sqliteTable('projects', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	repoUrl: text('repo_url'),
	website: text('website'),
	ownerId: text('owner_id').notNull().references(() => users.id),
	type: text('type', { enum: ['community', 'team', 'individual'] }).notNull().default('individual'),
	isBountyEnabled: integer('is_bounty_enabled', { mode: 'boolean' }).default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
});

export const bounties = sqliteTable('bounties', {
	id: text('id').primaryKey(),
	projectId: text('project_id').notNull().references(() => projects.id),
	title: text('title').notNull(),
	description: text('description'),
	amount: integer('amount').notNull(),
	status: text('status', { enum: ['open', 'in_progress', 'completed', 'paid'] }).notNull().default('open'),
	createdBy: text('created_by').notNull().references(() => users.id),
	assignedTo: text('assigned_to').references(() => users.id),
	salableCheckoutId: text('salable_checkout_id'),
	salablePaymentId: text('salable_payment_id'),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
});

export const bountyContributions = sqliteTable('bounty_contributions', {
	id: text('id').primaryKey(),
	bountyId: text('bounty_id').notNull().references(() => bounties.id),
	userId: text('user_id').notNull().references(() => users.id),
	amount: integer('amount').notNull(),
	salablePaymentId: text('salable_payment_id'),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
});

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Bounty = typeof bounties.$inferSelect;
export type BountyContribution = typeof bountyContributions.$inferSelect;
