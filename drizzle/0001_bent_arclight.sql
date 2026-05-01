DROP INDEX `account_userId_idx`;--> statement-breakpoint
DROP INDEX "users_username_unique";--> statement-breakpoint
DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `account` ALTER COLUMN "updated_at" TO "updated_at" integer NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
DROP INDEX `session_userId_idx`;--> statement-breakpoint
ALTER TABLE `session` ALTER COLUMN "updated_at" TO "updated_at" integer NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer));--> statement-breakpoint
DROP INDEX `verification_identifier_idx`;--> statement-breakpoint
ALTER TABLE `bounties` ADD `skills` text;--> statement-breakpoint
ALTER TABLE `bounties` ADD `priority` text DEFAULT 'medium';--> statement-breakpoint
ALTER TABLE `bounties` ADD `deadline` integer;--> statement-breakpoint
ALTER TABLE `bounties` ADD `submissionPR` text;--> statement-breakpoint
ALTER TABLE `bounties` ADD `submissionNotes` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `category` text DEFAULT 'other';--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `skills` text;