# Issue #2: Dev Onboarding MVP

**Type:** AFK  
**Blocked by:** #1 (RBAC Foundations)  
**Labels:** `needs-triage`, `onboarding`, `dev`

## User Stories Covered
As a Dev, sign up, build a profile, tag skills, join devteams, and get a guided path to post/claim first bounty.

## What to Build
A dedicated Dev onboarding flow including profile creation, skill taxonomy tagging, project/devteam association, and a guided first bounty scenario.

## Acceptance Criteria
- [x] Dev signup creates a profile; skills/tags can be added
- [ ] Dev can join a project devteam or indicate solo work
- [x] Onboarding includes a first-bounty walkthrough/tutorial

## Implementation Notes
- Added `bio`, `skills`, `githubUrl`, `onboardingComplete` to Better Auth `userAdditionalFields`
- Created deep modules: `src/lib/server/dev/` with `profile-logic.ts`, `api-logic.ts`
- 12 tests for profile logic (TDD approach)
- Created API endpoint `/api/dev/profile` for saving profile data
- Updated `/dev/dashboard` with dismissible onboarding modal (shows if `onboardingComplete=false`)
- Created static bounty tutorial page at `/dev/bounties/guide`
- Onboarding modal includes: bio (textarea), GitHub URL, skills (multi-select tags)
- Modal is dismissible with "Skip for now" - devs are smart, not forced
- Solo/Team preference determined by team membership (Issue #4 implements teams)
- Profile data accessible via `/dev/profile` anytime (not forced during onboarding)

## Rationale
Jumpstarts developer engagement and sets expectations for MVP.
