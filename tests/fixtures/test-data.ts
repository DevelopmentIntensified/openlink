export const testData = {
  user: {
    username: 'testuser',
    email: 'test@example.com',
    avatarUrl: 'https://example.com/avatar.png',
  },
  project: {
    name: 'Test Project',
    description: 'A test project for E2E testing',
    repoUrl: 'https://github.com/test/project',
    website: 'https://test-project.com',
    type: 'individual' as const,
    isBountyEnabled: true,
  },
  bounty: {
    title: 'Fix login bug',
    description: 'Fix the login bug on the homepage',
    amount: 5000, // $50.00
  },
};
