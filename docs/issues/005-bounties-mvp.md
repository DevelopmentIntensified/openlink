# Issue #5: Bounties MVP

## Overview
Implement the core bounty system allowing sponsors to post bounties on projects, and developers to view and claim them.

## Vertical Slice
- **Schema**: `bounties` table with title, description, amount, status, project_id, created_by, assigned_to
- **Logic**: `bounty-logic.ts` with create, list, getById, updateStatus, claim, submit
- **Pages**:
  - `/dashboard/bounties/new` - Create bounty (sponsors)
  - `/dashboard/bounties` - List bounties with filters
  - `/bounty/[id]` - Bounty detail + claim/submit workflow

## Acceptance Criteria
1. Sponsors can create bounties on their projects
2. Bounties have: title, description, amount, deadline, status (open/claimed/completed/cancelled)
3. Devs can view all open bounties on `/explore` or `/bounties`
4. Devs can claim open bounties
5. Devs can submit work for claimed bounties
6. Sponsors can approve/reject submissions
7. Platform fee (1%) calculated on bounty completion

## Tests (TDD)
- `bounty-logic.test.ts`: 20+ tests
  - createBounty (valid, invalid project, unauthorized)
  - listBounties (filters, pagination)
  - getBountyById (found, not found)
  - updateBountyStatus (valid transitions)
  - claimBounty (open→claimed)
  - submitBounty (claimed→submitted)
  - approveBounty (submitted→completed, fee calculation)
  - rejectBounty (submitted→claimed)

## Database Schema
```sql
CREATE TABLE bounties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount INTEGER NOT NULL, -- in cents
  status TEXT NOT NULL DEFAULT 'open', -- open, claimed, submitted, completed, cancelled
  deadline INTEGER, -- unix timestamp
  project_id TEXT NOT NULL REFERENCES projects(id),
  created_by TEXT NOT NULL REFERENCES user(id),
  assigned_to TEXT REFERENCES user(id),
  submitted_at INTEGER, -- unix timestamp
  submitted_url TEXT, -- PR or demo URL
  submitted_notes TEXT,
  approved_at INTEGER, -- unix timestamp
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_bounties_project ON bounties(project_id);
CREATE INDEX idx_bounties_status ON bounties(status);
CREATE INDEX idx_bounties_assigned ON bounties(assigned_to);
```

## Platform Fee Logic
- 1% fee on bounty amount (sponsor pays)
- On approve: sponsor charged (bounty + 1%), dev receives bounty amount
- Example: $1000 bounty → Sponsor pays $1010, Dev receives $1000

## Files to Create
1. `src/lib/server/bounties/bounty-logic.ts`
2. `src/lib/server/bounties/__tests__/bounty-logic.test.ts`
3. Update `src/lib/server/db/schema.ts` with bounties table
4. `src/routes/dashboard/bounties/new/+page.svelte`
5. `src/routes/dashboard/bounties/new/+page.server.ts`
6. `src/routes/dashboard/bounties/+page.svelte`
7. `src/routes/dashboard/bounties/+page.server.ts`
8. `src/routes/bounty/[id]/+page.svelte`
9. `src/routes/bounty/[id]/+page.server.ts`

## Status
- [ ] Schema added
- [ ] Logic implemented (TDD)
- [ ] Pages created
- [ ] Tests passing (20+)
- [ ] Build succeeds
- [ ] Committed and pushed
