# OpenLink - OSS Project & Bounty Platform

## Project Overview
A platform for open source developers to advertise their projects and receive payments through bounties. Companies and individuals can fund features/fixes they want, and developers can opt into the bounty program to earn money.

## Tech Stack
- **Framework**: SvelteKit 2
- **Styling**: Tailwind CSS 4
- **Database**: SQLite (LibSQL/Turso) + Drizzle ORM
- **Auth**: better-auth (with GitHub and Google OAuth)
- **Payments**: Salable (checkout links)
- **Testing**: Playwright (E2E)

---

## Database Schema

### users
| Column | Type | Description |
|--------|------|-------------|
| id | string | UUID primary key |
| username | string | Unique username |
| email | string? | User email |
| avatarUrl | string? | Profile picture URL |
| provider | string | 'github' or 'google' |
| providerId | string | OAuth provider ID |
| createdAt | timestamp | Creation date |

### sessions
| Column | Type | Description |
|--------|------|-------------|
| id | string | Session ID (25 chars) |
| userId | string | FK to users |
| expiresAt | timestamp | Expiration date |

### projects
| Column | Type | Description |
|--------|------|-------------|
| id | string | UUID primary key |
| name | string | Project name |
| description | string? | Project description |
| repoUrl | string? | GitHub/GitLab URL |
| website | string? | Project website |
| ownerId | string | FK to users |
| type | enum | 'community', 'team', 'individual' |
| isBountyEnabled | boolean | Bounty program enabled |
| createdAt | timestamp | Creation date |

### bounties
| Column | Type | Description |
|--------|------|-------------|
| id | string | UUID primary key |
| projectId | string | FK to projects |
| title | string | Bounty title |
| description | string? | Bounty description |
| amount | integer | Amount in cents |
| status | enum | 'open', 'in_progress', 'completed', 'paid' |
| createdBy | string | FK to users |
| assignedTo | string? | FK to users (developer) |
| salableCheckoutId | string? | Salable checkout reference |
| salablePaymentId | string? | Salable payment reference |
| createdAt | timestamp | Creation date |

### bounty_contributions
| Column | Type | Description |
|--------|------|-------------|
| id | string | UUID primary key |
| bountyId | string | FK to bounties |
| userId | string | FK to users (contributor) |
| amount | integer | Contribution amount in cents |
| salablePaymentId | string? | Salable payment reference |
| createdAt | timestamp | Creation date |

---

## Page Routes

| Route | Description |
|-------|-------------|
| `/` | Home - featured projects |
| `/explore` | Browse/search all projects |
| `/project/[id]` | Project details + bounties |
| `/project/[id]/bounty/[bountyId]` | Bounty detail |
| `/dashboard` | User dashboard (projects & bounties) |
| `/dashboard/project/new` | Create new project |
| `/dashboard/project/[id]/edit` | Edit project settings |
| `/dashboard/bounty/new/[projectId]` | Create new bounty |
| `/profile/[username]` | Public developer profile |
| `/login` | Login page |
| `/auth/github` | GitHub OAuth initiation |
| `/auth/github/callback` | GitHub OAuth callback |
| `/auth/google` | Google OAuth initiation |
| `/auth/google/callback` | Google OAuth callback |

---

## Environment Variables
```
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
PUBLIC_URL=http://localhost:5173
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
SALABLE_API_KEY=
SALABLE_BOUNTY_PLAN_UUID=
SALABLE_OWNER_ID=
```

---

## Development Principles
- **DRY**: Extract reusable components, utilities, and patterns
- **SOLID**: Single responsibility, Open-closed, Liskov substitution, Interface segregation, Dependency inversion
- **Maintainable**: Clear naming, consistent formatting, documented complex logic

## Workflow Rules
- Push to master after every completed feature
- Write E2E tests for every feature as it is developed
- All tests must pass before pushing

---

## Features (Implemented)

### Authentication
- [ ] GitHub OAuth login
- [ ] Google OAuth login
- [ ] Session-based auth with secure cookies
- [ ] 30-day session expiry

### Projects
- [ ] Create projects with name, description, repo URL, website
- [ ] Choose project type: Community, Team, or Individual
- [ ] Toggle bounty program on/off (opt-in)
- [ ] Edit project settings
- [ ] Delete projects (owner only)

### Bounties
- [ ] Create bounties on projects with bounty program enabled
- [ ] Set bounty amount
- [ ] Fund bounties via Salable checkout
- [ ] Claim bounties (developers)
- [ ] Complete bounties (assignee)
- [ ] Track bounty status

### Payments (Salable)
- [ ] Generate checkout links for bounty funding
- [ ] Handle success/cancel callbacks
- [ ] Track payment status
- [ ] Payout tracking for completed bounties

---

## Future Features

### MVP Features (Priority 1)

#### Team Management
- [ ] Team invites (email/username)
- [ ] Roles: owner, admin, member
- [ ] Remove members (owner/admin)
- [ ] Bounty creation permissions (owner + admins)

#### Bounty Enhancements
- [ ] Skill tags (JavaScript, Rust, Python, etc.)
- [ ] Priority levels (low, medium, high, urgent)
- [ ] Deadline (optional time limit)
- [ ] Submission requirements (PR link, notes)
- [ ] Review workflow (assignee submits work → owner approves → paid)

#### Search & Discovery
- [ ] Full-text search (projects, bounties)
- [ ] Filters: status, amount range, skills, project type
- [ ] Sorting: newest, highest bounty, deadline
- [ ] Categories for projects

#### User Profiles
- [ ] Bio/description
- [ ] Skills list
- [ ] Portfolio (completed bounties)
- [ ] Earnings history (private to user)
- [ ] Avatar upload (beyond OAuth)

### v2 Features (Priority 2)

#### Notifications
- [ ] In-app notification center
- [ ] Email notifications (new bounties, status changes, payments)

#### Analytics & Dashboard
- [ ] Project stats: total raised, bounties completed, active
- [ ] Developer stats: earnings, completed bounties
- [ ] Owner dashboard: spending, active bounties

#### Platform Revenue System
- [ ] Commission % on each bounty (configurable)
- [ ] Payment posting fee ($5 after 1st free)
- [ ] Fee collection + tracking
- [ ] Developer payout system

### v3 Features (Priority 3)

#### Trust & Workflow
- [ ] Work submission with PR/demo link
- [ ] Owner approval before payment release
- [ ] Cancel/abandon handling
- [ ] Refund workflow

#### Security & Validation
- [ ] Input sanitization
- [ ] Rate limiting
- [ ] CSRF protection
- [ ] Proper error handling

#### Enterprise Features
- [ ] Private projects (invite-only)
- [ ] API access
- [ ] Priority support
- [ ] Custom branding

---

## Monetization Tiers

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 1 bounty/month, 5% commission |
| Pro | $9/mo | Unlimited bounties, 3% commission, analytics |
| Enterprise | $49/mo | Team features, priority support, API |

---

## E2E Testing

### Framework: Playwright
- Native TypeScript support
- Auto-wait (reduces flakiness)
- Built-in SvelteKit testing via `webServer` config
- Great CI/CD integration

### Test Structure
```
tests/
├── e2e/
│   ├── auth/
│   │   ├── login-github.spec.ts
│   │   ├── login-google.spec.ts
│   │   └── logout.spec.ts
│   ├── projects/
│   │   ├── create-project.spec.ts
│   │   ├── edit-project.spec.ts
│   │   ├── delete-project.spec.ts
│   │   └── project-listings.spec.ts
│   ├── bounties/
│   │   ├── create-bounty.spec.ts
│   │   ├── fund-bounty.spec.ts
│   │   ├── claim-bounty.spec.ts
│   │   ├── complete-bounty.spec.ts
│   │   └── bounty-listings.spec.ts
│   ├── dashboard/
│   │   └── user-dashboard.spec.ts
│   └── profile/
│       └── public-profile.spec.ts
├── utils/
│   ├── test-user.ts
│   ├── test-project.ts
│   ├── test-bounty.ts
│   └── db.ts
└── fixtures/
    └── test-data.ts
```

### Playwright Configuration
```typescript
// playwright.config.ts
export default defineConfig({
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  timeout: 120000,
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
});
```

### CI/CD Integration
```yaml
# .github/workflows/e2e.yml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

---

## Task Checklist

### Setup Tasks (Before First Deploy)
- [ ] Set up Turso database and run migrations
- [ ] Configure environment variables (.env file)
- [ ] Set up OAuth apps in GitHub and Google
- [ ] Verify local dev server runs
- [ ] Test OAuth login flow
- [ ] Create first test project
- [ ] Create first test bounty
- [ ] Verify payment flow with Salable test mode
- [ ] Deploy to Vercel production
- [ ] Configure production OAuth callbacks

### Implementation Tasks

#### Phase 1: Foundation
- [ ] Initialize SvelteKit project
- [ ] Set up Tailwind CSS
- [ ] Configure Drizzle ORM
- [ ] Create database schema

#### Phase 2: Authentication
- [ ] Implement custom session auth
- [ ] Create OAuth endpoints (GitHub, Google)
- [ ] Build login page
- [ ] Add auth hooks

#### Phase 3: Projects
- [ ] Project CRUD operations
- [ ] Create project page
- [ ] Edit project page
- [ ] Project listing page (explore)
- [ ] Project detail page

#### Phase 4: Bounties
- [ ] Bounty CRUD operations
- [ ] Create bounty page
- [ ] Bounty listing (on project page)
- [ ] Bounty detail page
- [ ] Claim/complete workflow

#### Phase 5: Payments
- [ ] Salable integration
- [ ] Checkout link generation
- [ ] Payment success/cancel handling (basic)

#### Phase 6: UI/UX
- [ ] Home page
- [ ] Explore page
- [ ] User dashboard
- [ ] Profile pages
- [ ] Responsive design

#### Testing & DevOps
- [ ] Set up E2E tests with Playwright
- [ ] Configure CI/CD pipeline