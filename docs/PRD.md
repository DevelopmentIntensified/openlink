# BountyForge MVP - Product Requirements Document

## Overview
BountyForge enables developers to claim bounties on open-source dependencies they use, while sponsors fund features they need. This PRD covers the MVP vertical slices for an end-to-end dev-first bounty platform.

**Tagline:** Forge the features you need from your dependencies  
**Value Prop:** Put your money where your need is

## MVP Scope
- Dev onboarding & profiles
- Sponsor onboarding & bounty posting
- Projects & DevTeams management
- Bounty lifecycle (post → claim → submit → review → payout)
- Payments & escrow
- Dispute resolution
- RBAC (Dev vs Sponsor)
- Admin & analytics
- End-to-end testing

## Key Design Decisions (RBAC Issue #1)

- **Role Storage**: `roles` array via Better Auth `userAdditionalFields` (e.g., `['dev']`, `['sponsor','admin']`)
- **Signup**: Separate routes `/dev/signup` and `/sponsor/signup` (role determined by route)
- **Login**: Shared `/auth/login` with post-login role selection for dual-role users
- **Routing**: `/dev/*` (dashboard, profile, bounties, teams, projects), `/sponsor/*` (dashboard, bounties), `/admin/*` (admin only)
- **Enforcement**: Single `hooks.server.ts` checks session + `user.roles.includes(role)` per route prefix
- **Role Switcher**: Nav bar toggle for users with both `['dev','sponsor']` roles
- **Admin**: Manually assigned by adding `'admin'` to roles array. Dedicated `/admin/*` routes

## Vertical Slices (Issues)

| # | Issue | Blocked By | Type |
|---|-------|------------|------|
| 1 | RBAC Foundations | None | AFK |
| 2 | Dev Onboarding MVP | #1 | AFK |
| 3 | Sponsor Onboarding MVP | #1 | AFK |
| 4 | Projects & DevTeams MVP | #1 | AFK |
| 5 | Bounties MVP | #2, #3, #4 | AFK |
| 6 | Submissions & Review MVP | #5 | AFK |
| 7 | Payments & Escrow MVP | #5, #6 | AFK |
| 8 | Disputes MVP | #7 | AFK |
| 9 | Admin & Analytics MVP | All MVP | AFK |
| 10 | MVP UI/UX & Accessibility | All MVP | AFK |
| 11 | MVP End-to-End Testing | #5, #6, #7 | AFK |
| 12 | Go-To-Market & Community Launch | MVP Ready | AFK |

## Testing Strategy
- End-to-end MVP scenarios (signup → onboarding → post bounty → claim → submit → review → payout)
- RBAC enforcement tests (Dev vs Sponsor permissions)
- Bounty lifecycle tests (states: open, claimed, in-review, payout)
- Payment/escrow tests (funding, escrow state, payout)
- Dispute handling tests (escalation, partial payout)
- Accessibility checks for critical flows

## Success Metrics (GTM)
- First 10-20 devs onboarded
- Initial bounties posted
- End-to-end flow validated with real users
