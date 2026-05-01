# User Actionable Items - OpenLink MVP Setup

## 1. OAuth Setup (GitHub & Google)

### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: OpenLink
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `http://localhost:5173/api/auth/callback/github`
4. Copy credentials to `.env`:
   ```
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   ```

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → APIs & Services → Credentials
3. Create OAuth Client ID (Web application)
4. Add authorized origins: `http://localhost:5173`
5. Add authorized redirect URIs: `http://localhost:5173/api/auth/callback/google`
6. Copy credentials to `.env`:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

---

## 2. Salable Payment Setup

1. Go to [Salable](https://salable.io/) and create an account
2. Create a product for bounty payments
3. Get your API credentials and add to `.env`:
   ```
   SALABLE_API_KEY=your_api_key
   SALABLE_BOUNTY_PLAN_UUID=your_plan_uuid
   SALABLE_OWNER_ID=your_owner_id
   ```

---

## 3. Database Setup

Run the database migration to create tables:
```bash
npm run db:push
```

Or if using Turso:
```bash
npx drizzle-kit push
```

---

## 4. Start Development Server

```bash
npm run dev
```

Then visit `http://localhost:5173`

---

## 5. Test the Flow

1. Sign up/login with email or OAuth
2. Create a new project with "Enable bounty program" checked
3. Create a bounty for that project
4. Test the claim/submit/complete workflow

---

## Routes Created

| Route | Description |
|-------|-------------|
| `/` | Home page with featured projects |
| `/explore` | Browse all projects with search |
| `/project/[id]` | Project details + bounties |
| `/project/[id]/bounty/[bountyId]` | Bounty detail + claim/submit |
| `/dashboard` | User dashboard |
| `/dashboard/project/new` | Create new project |
| `/dashboard/bounty/new/[projectId]` | Create new bounty |
| `/profile/[username]` | Public developer profile |
| `/login` | Login page with OAuth |
