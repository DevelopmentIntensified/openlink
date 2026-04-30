# Issue #1: RBAC Foundations (Dev vs Sponsor)

**Type:** AFK  
**Blocked by:** None  
**Labels:** `needs-triage`, `rbac`, `foundation`

## User Stories Covered
RBAC as a backbone for all MVP features; ensures proper dashboards and actions per role.

## What to Build
Define and implement role-based access control (Dev, Sponsor, Admin) with per-role dashboards, permissions, and guards on core endpoints (auth, bounty, project, payout).

## Design Decisions (Grilled)

### 1. Role Storage
- **Decision**: Use Better Auth `userAdditionalFields` with `roles` as an array of strings
- **Implementation**: `roles: { type: 'array', items: { type: 'string' }, defaultValue: ['dev'] }`
- **Storage**: TEXT[] in SQLite
- **Multi-role support**: Users can have both `['dev', 'sponsor']` or `['dev', 'sponsor', 'admin']`

### 2. Role Assignment During Signup
- **Decision**: Separate signup routes determine role
- **Routes**: `/dev/signup` → role 'dev', `/sponsor/signup` → role 'sponsor'
- **Implementation**: `+page.server.ts` reads the route to determine role, passes to `auth.signUp()` via data field
- **Remove**: Existing `/auth/signup` route (direct routes only)

### 3. Login Flow
- **Decision**: Shared login (`/auth/login` or `/login`)
- **Post-login**: Redirect to `/dev/dashboard` by default
- **Dual-role users**: Show "Are you a Dev or Sponsor?" role selection after login if user has both roles
- **Role switcher**: Nav bar toggle with redirect for switching between `/dev/*` and `/sponsor/*`

### 4. Route Structure
- **Prefix pattern**: Separate route prefixes for role-based access
  - `/dev/*`: dashboard, profile, bounties, teams, projects (devs have projects)
  - `/sponsor/*`: dashboard, bounties (sponsors don't have projects)
  - `/admin/*`: admin-only routes (dedicated, with own layout and hooks)
- **Unprefixed routes**: Auto-redirect based on user's default role (dev)

### 5. RBAC Enforcement
- **Decision**: Single `hooks.server.ts` with unified check
- **Logic**:
  1. Check if route starts with `/dev/`, `/sponsor/`, or `/admin/`
  2. Skip auth check for `*/signup` and `*/login` routes
  3. Verify session exists (for protected routes)
  4. Check `user.roles.includes('dev'|'sponsor'|'admin')` matches route prefix
  5. Return 403 or redirect if unauthorized
- **Mismatch handling**: Redirect to `/auth/signup?role=dev` (or sponsor) if role doesn't match

### 6. Role in Frontend
- **Decision**: Session data via layout
- **Implementation**: Use `auth.getSession()` in `+layout.server.ts`, pass role to client via `data` prop
- **Client access**: Read role from session data in components for conditional UI

### 7. Admin Role
- **Decision**: Add `'admin'` to roles array (e.g., `['dev', 'admin']`)
- **Assignment**: Manually assigned by you (admin) in DB
- **Access**: Dedicated `/admin/*` routes with hook checking for `'admin'` in roles array

### 8. Schema Migration
- **Decision**: Regenerate auth schema + push
- **Command**: `npm run auth:schema` to regenerate `auth.schema.ts` with `roles` field
- **Then**: `npm run db:push` to add column to existing DB
- **Note**: Existing users get `defaultValue: ['dev']`

### 9. No Roles Assigned
- **Decision**: Force role selection
- **Implementation**: If `user.roles` is empty, redirect to signup with role picker

## Acceptance Criteria
- [x] `roles` array column exists in user table via `userAdditionalFields`
- [x] `/dev/signup` and `/sponsor/signup` routes created (remove `/auth/signup`)
- [x] `hooks.server.ts` enforces role-based access on `/dev/*`, `/sponsor/*`, `/admin/*`
- [x] Core endpoints enforce role-based access (e.g., only Dev can claim, only Sponsor can post bounty)
- [x] Shared `/auth/login` with post-login role-based redirect
- [x] Nav bar role switcher for dual-role users
- [x] Session data includes `roles` array, accessible in frontend
- [x] Admin role can be manually added to users
- [x] Separate dashboards: Dev (with projects), Sponsor (no projects), Admin

## Implementation Notes
- Deep modules created: `src/lib/server/rbac/` with `index.ts`, `route-guard.ts`, `signup-logic.ts`, `role-switcher.ts`, `admin.ts`, `endpoint-guards.ts`
- All modules are testable with vitest (80 tests passing: 32 + 18 + 13 + 17)
- `auth.ts` refactored to export `authConfig` for testability
- `userAdditionalFields` configured with `roles: { type: 'array', defaultValue: ['dev'] }`
- Route guard logic separated from SvelteKit (pure functions in `route-guard.ts`)
- Signup logic separated from SvelteKit (pure functions in `signup-logic.ts`)
- Role switcher logic separated from SvelteKit (pure functions in `role-switcher.ts`)
- Admin logic separated from SvelteKit (pure functions in `admin.ts`)
- Endpoint guards separated from SvelteKit (pure functions in `endpoint-guards.ts`)
- `hooks.server.ts` uses `checkRouteAccess()` from route-guard module
- Created `/dev/signup` and `/sponsor/signup` routes (removed `/auth/signup`)
- Created shared `/auth/login` with role selection for dual-role users
- Created `/api/auth/signup` and `/api/auth/login` endpoints
- Created `RoleSwitcher.svelte` component using deep module logic
- Created dashboards: `/dev/dashboard` (with projects), `/sponsor/dashboard` (no projects), `/admin/dashboard`
- Each dashboard has `+page.server.ts` for role verification
- Endpoint guards (`endpoint-guards.ts`) enforce: claim→dev, post→sponsor, submit→dev, review→sponsor, projects→dev, admin→admin

## Rationale
This enables safe, scalable MVP; everything else sits on top of proper RBAC. Multi-role support allows users to be both devs and sponsors. All logic is in deep modules (pure functions) for maximum testability and maintainability.

## Rationale
This enables safe, scalable MVP; everything else sits on top of proper RBAC. Multi-role support allows users to be both devs and sponsors.
