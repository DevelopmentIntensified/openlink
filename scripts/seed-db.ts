import { createClient } from '@libsql/client';
import 'dotenv/config';

const client = createClient({
	url: process.env.DATABASE_URL || 'file:openlink.db',
	authToken: process.env.DATABASE_AUTH_TOKEN || undefined
});

async function seed() {
	console.log('Seeding test database...');

	const now = Date.now();

	await client.execute(`DELETE FROM bounty_contributions`);
	await client.execute(`DELETE FROM bounties`);
	await client.execute(`DELETE FROM projects`);
	await client.execute(`DELETE FROM sessions`);
	await client.execute(`DELETE FROM users`);
	await client.execute(`DELETE FROM account`);
	await client.execute(`DELETE FROM session`);
	await client.execute(`DELETE FROM verification`);
	await client.execute(`DELETE FROM user`);

	console.log('Cleared existing data');

	await client.execute({
		sql: `INSERT INTO users (id, username, email, avatarUrl, bio, skills, provider, providerId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			'user_alice',
			'alice_dev',
			'alice@example.com',
			'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
			'Full-stack developer passionate about open source and AI',
			'["React", "TypeScript", "Python", "Machine Learning"]',
			'github',
			'gh_alice',
			now
		]
	});

	await client.execute({
		sql: `INSERT INTO users (id, username, email, avatarUrl, bio, skills, provider, providerId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			'user_bob',
			'bob_builder',
			'bob@example.com',
			'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
			'Backend engineer specializing in distributed systems',
			'["Go", "Rust", "Kubernetes", "PostgreSQL"]',
			'github',
			'gh_bob',
			now
		]
	});

	await client.execute({
		sql: `INSERT INTO users (id, username, email, avatarUrl, bio, skills, provider, providerId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			'user_carol',
			'carol_crypto',
			'carol@example.com',
			'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
			'Blockchain developer and DeFi enthusiast',
			'["Solidity", "Rust", "Web3", "TypeScript"]',
			'github',
			'gh_carol',
			now
		]
	});

	await client.execute({
		sql: `INSERT INTO users (id, username, email, avatarUrl, bio, skills, provider, providerId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			'user_dave',
			'dave_devops',
			'dave@example.com',
			'https://api.dicebear.com/7.x/avataaars/svg?seed=dave',
			'DevOps engineer and cloud architect',
			'["AWS", "Terraform", "Docker", "Python"]',
			'github',
			'gh_dave',
			now
		]
	});

	console.log('Created users');

	await client.execute({
		sql: `INSERT INTO projects (id, name, description, repoUrl, website, category, ownerId, type, isBountyEnabled, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			'proj_awesome',
			'Awesome App',
			'A modern web application for managing tasks and projects with real-time collaboration',
			'https://github.com/example/awesome-app',
			'https://awesome-app.example.com',
			'web',
			'user_alice',
			'individual',
			1,
			now
		]
	});

	await client.execute({
		sql: `INSERT INTO projects (id, name, description, repoUrl, website, category, ownerId, type, isBountyEnabled, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			'proj_ml_lib',
			'ML Library',
			'A lightweight machine learning library for Python with focus on interpretability',
			'https://github.com/example/ml-library',
			'https://ml-lib.example.com',
			'ai-ml',
			'user_bob',
			'individual',
			1,
			now
		]
	});

	await client.execute({
		sql: `INSERT INTO projects (id, name, description, repoUrl, website, category, ownerId, type, isBountyEnabled, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			'proj_defi_swap',
			'DeFi Swap',
			'Decentralized exchange protocol with low fees and fast transactions',
			'https://github.com/example/defi-swap',
			'https://defi-swap.example.com',
			'blockchain',
			'user_carol',
			'individual',
			1,
			now
		]
	});

	await client.execute({
		sql: `INSERT INTO projects (id, name, description, repoUrl, website, category, ownerId, type, isBountyEnabled, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			'proj_cloud_cli',
			'Cloud CLI',
			'Command-line tool for managing cloud infrastructure across multiple providers',
			'https://github.com/example/cloud-cli',
			'',
			'devtools',
			'user_dave',
			'individual',
			1,
			now
		]
	});

	await client.execute({
		sql: `INSERT INTO projects (id, name, description, repoUrl, website, category, ownerId, type, isBountyEnabled, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			'proj_mobile_app',
			'Mobile Wallet',
			'Cross-platform mobile wallet for cryptocurrencies',
			'https://github.com/example/mobile-wallet',
			'https://mobile-wallet.example.com',
			'mobile',
			'user_carol',
			'individual',
			1,
			now
		]
	});

	console.log('Created projects');

	await client.execute({
		sql: `INSERT INTO bounties (id, projectId, title, description, skills, amount, priority, deadline, status, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			'bounty_1',
			'proj_awesome',
			'Add real-time collaboration',
			'Implement real-time collaboration using WebSockets for multiple users editing tasks simultaneously',
			'["React", "WebSocket", "Node.js"]',
			500,
			'high',
			now + 30 * 24 * 60 * 60 * 1000,
			'open',
			'user_alice',
			now
		]
	});

	await client.execute({
		sql: `INSERT INTO bounties (id, projectId, title, description, skills, amount, priority, deadline, status, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			'bounty_2',
			'proj_awesome',
			'Mobile responsive design',
			'Improve mobile responsiveness and add touch gestures for the task board',
			'["CSS", "React", "Mobile"]',
			300,
			'medium',
			now + 45 * 24 * 60 * 60 * 1000,
			'open',
			'user_alice',
			now
		]
	});

	await client.execute({
		sql: `INSERT INTO bounties (id, projectId, title, description, skills, amount, priority, deadline, status, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			'bounty_3',
			'proj_ml_lib',
			'Add model explainability',
			'Implement SHAP values calculation for model predictions',
			'["Python", "Machine Learning", "NumPy"]',
			800,
			'high',
			now + 60 * 24 * 60 * 60 * 1000,
			'open',
			'user_bob',
			now
		]
	});

	await client.execute({
		sql: `INSERT INTO bounties (id, projectId, title, description, skills, amount, priority, deadline, status, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			'bounty_4',
			'proj_ml_lib',
			'Optimize training speed',
			'Add GPU acceleration support using CUDA for faster model training',
			'["Python", "CUDA", "Deep Learning"]',
			1200,
			'medium',
			now + 90 * 24 * 60 * 60 * 1000,
			'open',
			'user_bob',
			now
		]
	});

	await client.execute({
		sql: `INSERT INTO bounties (id, projectId, title, description, skills, amount, priority, deadline, status, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			'bounty_5',
			'proj_defi_swap',
			'Add limit orders',
			'Implement limit order functionality for the DEX',
			'["Solidity", "TypeScript", "Web3"]',
			1500,
			'high',
			now + 30 * 24 * 60 * 60 * 1000,
			'open',
			'user_carol',
			now
		]
	});

	await client.execute({
		sql: `INSERT INTO bounties (id, projectId, title, description, skills, amount, priority, deadline, status, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			'bounty_6',
			'proj_defi_swap',
			'Improve gas efficiency',
			'Optimize contract gas usage and reduce transaction costs',
			'["Solidity", "Gas Optimization"]',
			2000,
			'high',
			now + 21 * 24 * 60 * 60 * 1000,
			'open',
			'user_carol',
			now
		]
	});

	await client.execute({
		sql: `INSERT INTO bounties (id, projectId, title, description, skills, amount, priority, deadline, status, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			'bounty_7',
			'proj_cloud_cli',
			'AWS provider support',
			'Add AWS as a cloud provider with full resource management',
			'["Go", "AWS SDK", "CLI"]',
			1000,
			'high',
			now + 45 * 24 * 60 * 60 * 1000,
			'open',
			'user_dave',
			now
		]
	});

	await client.execute({
		sql: `INSERT INTO bounties (id, projectId, title, description, skills, amount, priority, deadline, status, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			'bounty_8',
			'proj_cloud_cli',
			'Terraform export',
			'Add functionality to export current state to Terraform configuration',
			'["Go", "Terraform", "HCL"]',
			600,
			'medium',
			now + 60 * 24 * 60 * 60 * 1000,
			'open',
			'user_dave',
			now
		]
	});

	await client.execute({
		sql: `INSERT INTO bounties (id, projectId, title, description, skills, amount, priority, deadline, status, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			'bounty_9',
			'proj_mobile_app',
			'iOS biometric auth',
			'Implement Face ID and Touch ID authentication for iOS',
			'["React Native", "iOS", "Biometrics"]',
			750,
			'high',
			now + 30 * 24 * 60 * 60 * 1000,
			'open',
			'user_carol',
			now
		]
	});

	console.log('Created bounties');

	await client.execute({
		sql: `INSERT INTO bounty_contributions (id, bountyId, userId, amount, createdAt) VALUES (?, ?, ?, ?, ?)`,
		args: ['contrib_1', 'bounty_1', 'user_bob', 200, now]
	});

	await client.execute({
		sql: `INSERT INTO bounty_contributions (id, bountyId, userId, amount, createdAt) VALUES (?, ?, ?, ?, ?)`,
		args: ['contrib_2', 'bounty_1', 'user_carol', 300, now]
	});

	await client.execute({
		sql: `INSERT INTO bounty_contributions (id, bountyId, userId, amount, createdAt) VALUES (?, ?, ?, ?, ?)`,
		args: ['contrib_3', 'bounty_5', 'user_dave', 500, now]
	});

	await client.execute({
		sql: `INSERT INTO bounty_contributions (id, bountyId, userId, amount, createdAt) VALUES (?, ?, ?, ?, ?)`,
		args: ['contrib_4', 'bounty_5', 'user_alice', 1000, now]
	});

	console.log('Created bounty contributions');

	console.log('Seed complete!');
}

seed().catch(console.error);
