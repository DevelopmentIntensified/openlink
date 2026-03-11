import { testDb, generateId } from './db';
import { projects } from '../../src/lib/server/schema';

export async function createTestProject(ownerId: string, overrides: Partial<{
  name: string;
  description: string;
  repoUrl: string;
  website: string;
  type: 'community' | 'team' | 'individual';
  isBountyEnabled: boolean;
}> = {}) {
  const defaultName = `test-project-${generateId().slice(0, 8)}`;
  
  const [project] = await testDb.insert(projects).values({
    id: generateId(),
    name: overrides.name || defaultName,
    description: overrides.description || 'Test project description',
    repoUrl: overrides.repoUrl || 'https://github.com/test/project',
    website: overrides.website || 'https://test-project.com',
    ownerId,
    type: overrides.type || 'individual',
    isBountyEnabled: overrides.isBountyEnabled ?? true,
  }).returning();
  
  return project;
}
