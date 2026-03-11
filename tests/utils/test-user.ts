import { testDb, generateId } from './db';
import { users, sessions } from '../../src/lib/server/schema';
import { addDays } from 'date-fns';

export async function createTestUser(overrides: Partial<{
  username: string;
  email: string;
  avatarUrl: string;
  provider: string;
  providerId: string;
}> = {}) {
  const defaultUsername = `testuser_${generateId().slice(0, 8)}`;
  
  const [user] = await testDb.insert(users).values({
    id: generateId(),
    username: overrides.username || defaultUsername,
    email: overrides.email || `${defaultUsername}@test.com`,
    avatarUrl: overrides.avatarUrl || null,
    provider: overrides.provider || 'github',
    providerId: overrides.providerId || generateId(),
  }).returning();
  
  return user;
}

export async function createTestSession(userId: string) {
  const sessionId = generateId().slice(0, 25);
  const expiresAt = addDays(new Date(), 30);
  
  await testDb.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
  });
  
  return sessionId;
}

export async function createAuthenticatedUser() {
  const user = await createTestUser();
  const sessionId = await createTestSession(user.id);
  return { user, sessionId };
}
