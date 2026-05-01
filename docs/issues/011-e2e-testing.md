# Issue #11: MVP End-to-End Testing

**Type:** AFK  
**Blocked by:** #5 (Bounties MVP), #6 (Submissions MVP), #7 (Payments MVP)  
**Labels:** `needs-triage`, `testing`, `e2e`

## User Stories Covered
Coverage of complete MVP flows.

## What to Build
End-to-end tests for signup → onboarding → create bounty → claim → submit → review → payout; dispute path.

## Acceptance Criteria
- [ ] E2E tests pass; critical paths validated

## Testing Focus
- End-to-end MVP scenarios (signup → onboarding → post bounty → claim → submit → review → payout)
- RBAC enforcement tests (Dev vs Sponsor permissions)
- Bounty lifecycle tests (states: open, claimed, in-review, payout)
- Payment/escrow tests (funding, escrow state, payout)
- Dispute handling tests (escalation, partial payout)
- Accessibility checks for critical flows (onboarding, forms, CTAs)

## Rationale
Ensures MVP reliability and regression resistance.
