DROP TABLE IF EXISTS "devteam_members";
DROP TABLE IF EXISTS "devteams";
DROP TABLE IF EXISTS "bounty_contributions";
DROP TABLE IF EXISTS "bounties";
DROP TABLE IF EXISTS "projects";
DROP TABLE IF EXISTS "verification";
DROP TABLE IF EXISTS "account";
DROP TABLE IF EXISTS "session";
DROP TABLE IF EXISTS "user";

CREATE TABLE "user" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "email_verified" integer NOT NULL DEFAULT 0,
  "image" text,
  "created_at" integer NOT NULL,
  "updated_at" integer NOT NULL,
  "roles" text DEFAULT '["dev"]',
  "bio" text DEFAULT '',
  "skills" text DEFAULT '[]',
  "github_url" text DEFAULT '',
  "onboarding_complete" integer DEFAULT 0,
  "company_name" text DEFAULT '',
  "company_website" text DEFAULT '',
  "company_description" text DEFAULT '',
  "username" text DEFAULT ''
);

CREATE UNIQUE INDEX "user_email_unique" ON "user" ("email");
CREATE UNIQUE INDEX "user_username_unique" ON "user" ("username");

CREATE TABLE "session" (
  "id" text PRIMARY KEY NOT NULL,
  "expires_at" integer NOT NULL,
  "token" text NOT NULL,
  "created_at" integer NOT NULL,
  "updated_at" integer NOT NULL,
  "ip_address" text,
  "user_agent" text,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "session_token_unique" ON "session" ("token");
CREATE INDEX "session_userId_idx" ON "session" ("user_id");

CREATE TABLE "account" (
  "id" text PRIMARY KEY NOT NULL,
  "account_id" text NOT NULL,
  "provider_id" text NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "access_token" text,
  "refresh_token" text,
  "id_token" text,
  "access_token_expires_at" integer,
  "refresh_token_expires_at" integer,
  "scope" text,
  "password" text,
  "created_at" integer NOT NULL,
  "updated_at" integer NOT NULL
);

CREATE INDEX "account_userId_idx" ON "account" ("user_id");

CREATE TABLE "verification" (
  "id" text PRIMARY KEY NOT NULL,
  "identifier" text NOT NULL,
  "value" text NOT NULL,
  "expires_at" integer NOT NULL,
  "created_at" integer NOT NULL,
  "updated_at" integer NOT NULL
);

CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");

CREATE TABLE "projects" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "repoUrl" text,
  "website" text,
  "category" text DEFAULT 'other',
  "ownerId" text NOT NULL REFERENCES "user"("id"),
  "type" text NOT NULL DEFAULT 'individual',
  "isBountyEnabled" integer NOT NULL DEFAULT 0,
  "createdAt" integer NOT NULL
);

CREATE TABLE "bounties" (
  "id" text PRIMARY KEY NOT NULL,
  "projectId" text NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "description" text,
  "skills" text,
  "amount" integer NOT NULL,
  "priority" text DEFAULT 'medium',
  "deadline" integer,
  "status" text NOT NULL DEFAULT 'open',
  "createdBy" text NOT NULL REFERENCES "user"("id"),
  "assignedTo" text REFERENCES "user"("id"),
  "submissionPR" text,
  "submissionNotes" text,
  "submissionDate" integer,
  "completedAt" integer,
  "paidAt" integer,
  "createdAt" integer NOT NULL
);

CREATE TABLE "bounty_contributions" (
  "id" text PRIMARY KEY NOT NULL,
  "bountyId" text NOT NULL REFERENCES "bounties"("id") ON DELETE CASCADE,
  "userId" text NOT NULL REFERENCES "user"("id"),
  "amount" integer NOT NULL,
  "stripePaymentId" text,
  "createdAt" integer NOT NULL
);

CREATE TABLE "devteams" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "projectId" text REFERENCES "projects"("id") ON DELETE CASCADE,
  "ownerId" text NOT NULL REFERENCES "user"("id"),
  "createdAt" integer NOT NULL
);

CREATE TABLE "devteam_members" (
  "id" text PRIMARY KEY NOT NULL,
  "devteamId" text NOT NULL REFERENCES "devteams"("id") ON DELETE CASCADE,
  "userId" text NOT NULL REFERENCES "user"("id"),
  "joinedAt" integer NOT NULL
);
