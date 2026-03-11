# OpenLink - OSS Project & Bounty Platform

## Project Overview
A platform for open source developers to advertise their projects and receive payments through bounties. Companies and individuals can fund features/fixes they want, and developers can opt into the bounty program to earn money.

## Tech Stack
- **Framework**: SvelteKit 2
- **Styling**: Tailwind CSS 4
- **Database**: SQLite (LibSQL/Turso) + Drizzle ORM
- **Auth**: Custom session-based with Arctic OAuth
- **Payments**: Salable (checkout links)

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

## Features

### Authentication
- GitHub OAuth login
- Google OAuth login
- Session-based auth with secure cookies
- 30-day session expiry

### Projects
- Create projects with name, description, repo URL, website
- Choose project type: Community, Team, or Individual
- Toggle bounty program on/off (opt-in)
- Edit project settings
- Delete projects (owner only)

### Bounties
- Create bounties on projects with bounty program enabled
- Set bounty amount
- Fund bounties via Salable checkout
- Claim bounties (developers)
- Complete bounties (assignee)
- Track bounty status

### Payments (Salable)
- Generate checkout links for bounty funding
- Handle success/cancel callbacks
- Track payment status

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
```

## Implementation Tasks

### Phase 1: Foundation
- [x] Initialize SvelteKit project
- [x] Set up Tailwind CSS
- [x] Configure Drizzle ORM
- [x] Create database schema

### Phase 2: Authentication
- [ ] Implement custom session auth
- [ ] Create OAuth endpoints (GitHub, Google)
- [ ] Build login page
- [ ] Add auth hooks

### Phase 3: Projects
- [ ] Project CRUD operations
- [ ] Create project page
- [ ] Edit project page
- [ ] Project listing page
- [ ] Project detail page

### Phase 4: Bounties
- [ ] Bounty CRUD operations
- [ ] Create bounty page
- [ ] Bounty listing (on project page)
- [ ] Bounty detail page
- [ ] Claim/complete workflow

### Phase 5: Payments
- [ ] Salable integration
- [ ] Checkout link generation
- [ ] Payment success/cancel handling
- [ ] Payout tracking

### Phase 6: UI/UX
- [ ] Home page
- [ ] Explore page
- [ ] User dashboard
- [ ] Profile pages
- [ ] Responsive design
