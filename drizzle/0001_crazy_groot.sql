ALTER TABLE `user` ADD `roles` text DEFAULT '["dev"]';--> statement-breakpoint
ALTER TABLE `user` ADD `bio` text DEFAULT '';--> statement-breakpoint
ALTER TABLE `user` ADD `skills` text DEFAULT '[]';--> statement-breakpoint
ALTER TABLE `user` ADD `github_url` text DEFAULT '';--> statement-breakpoint
ALTER TABLE `user` ADD `onboarding_complete` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `user` ADD `company_name` text DEFAULT '';--> statement-breakpoint
ALTER TABLE `user` ADD `company_website` text DEFAULT '';--> statement-breakpoint
ALTER TABLE `user` ADD `company_description` text DEFAULT '';