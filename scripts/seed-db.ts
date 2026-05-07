import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/lib/server/db/schema';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

async function seed() {
	console.log('Seeding Neon PostgreSQL database...');

	const now = new Date();

	// Clean existing data in reverse dependency order
	await db.delete(schema.bountyContributions);
	await db.delete(schema.bounties);
	await db.delete(schema.devteamMembers);
	await db.delete(schema.devteams);
	await db.delete(schema.projects);
	await db.delete(schema.verification);
	await db.delete(schema.account);
	await db.delete(schema.session);
	await db.delete(schema.user);

	console.log('Cleared existing data');

	// Create seed users (minimal fields for Better Auth user table)
	const users = [
		{
			id: 'user_alice',
			name: 'Alice Dev',
			email: 'alice@example.com',
			emailVerified: true,
			image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
			roles: ['dev'],
			bio: 'Full-stack developer passionate about open source and AI',
			skills: ['React', 'TypeScript', 'Python', 'Machine Learning'],
			githubUrl: 'https://github.com/alice',
			username: 'alice_dev',
			createdAt: now,
			updatedAt: now
		},
		{
			id: 'user_bob',
			name: 'Bob Builder',
			email: 'bob@example.com',
			emailVerified: true,
			image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
			roles: ['dev'],
			bio: 'Backend engineer specializing in distributed systems',
			skills: ['Go', 'Rust', 'Kubernetes', 'PostgreSQL'],
			githubUrl: 'https://github.com/bob',
			username: 'bob_builder',
			createdAt: now,
			updatedAt: now
		},
		{
			id: 'user_carol',
			name: 'Carol Crypto',
			email: 'carol@example.com',
			emailVerified: true,
			image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
			roles: ['dev'],
			bio: 'Blockchain developer and DeFi enthusiast',
			skills: ['Solidity', 'Rust', 'Web3', 'TypeScript'],
			githubUrl: 'https://github.com/carol',
			username: 'carol_crypto',
			createdAt: now,
			updatedAt: now
		},
		{
			id: 'user_dave',
			name: 'Dave DevOps',
			email: 'dave@example.com',
			emailVerified: true,
			image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dave',
			roles: ['dev'],
			bio: 'DevOps engineer and cloud architect',
			skills: ['AWS', 'Terraform', 'Docker', 'Python'],
			githubUrl: 'https://github.com/dave',
			username: 'dave_devops',
			createdAt: now,
			updatedAt: now
		}
	];

	for (const u of users) {
		await db.insert(schema.user).values(u);
	}
	console.log(`Created ${users.length} users`);

	// Create projects
	const projectData = [
		{
			id: 'proj_awesome',
			name: 'Awesome App',
			description: 'A modern web application for managing tasks and projects',
			repoUrl: 'https://github.com/example/awesome-app',
			website: 'https://awesome-app.example.com',
			category: 'web' as const,
			ownerId: 'user_alice',
			type: 'individual' as const,
			isBountyEnabled: true
		},
		{
			id: 'proj_ml_lib',
			name: 'ML Library',
			description: 'A lightweight machine learning library for Python',
			repoUrl: 'https://github.com/example/ml-library',
			website: 'https://ml-lib.example.com',
			category: 'other' as const,
			ownerId: 'user_bob',
			type: 'individual' as const,
			isBountyEnabled: true
		},
		{
			id: 'proj_defi_swap',
			name: 'DeFi Swap',
			description: 'Decentralized exchange protocol with low fees',
			repoUrl: 'https://github.com/example/defi-swap',
			website: 'https://defi-swap.example.com',
			category: 'other' as const,
			ownerId: 'user_carol',
			type: 'individual' as const,
			isBountyEnabled: true
		},
		{
			id: 'proj_cloud_cli',
			name: 'Cloud CLI',
			description: 'Command-line tool for managing cloud infrastructure',
			repoUrl: 'https://github.com/example/cloud-cli',
			website: '',
			category: 'other' as const,
			ownerId: 'user_dave',
			type: 'individual' as const,
			isBountyEnabled: true
		},
		{
			id: 'proj_mobile_app',
			name: 'Mobile Wallet',
			description: 'Cross-platform mobile wallet for cryptocurrencies',
			repoUrl: 'https://github.com/example/mobile-wallet',
			website: 'https://mobile-wallet.example.com',
			category: 'other' as const,
			ownerId: 'user_carol',
			type: 'individual' as const,
			isBountyEnabled: true
		}
	];

	for (const p of projectData) {
		await db.insert(schema.projects).values({ ...p, createdAt: now });
	}
	console.log(`Created ${projectData.length} projects`);

	// Create bounties
	const bountyData = [
		{
			id: 'bounty_1',
			projectId: 'proj_awesome',
			title: 'Add real-time collaboration',
			description: 'Implement real-time collaboration using WebSockets',
			skills: '["React","WebSocket","Node.js"]',
			amount: 500,
			priority: 'high' as const,
			deadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
			status: 'open' as const,
			createdBy: 'user_alice'
		},
		{
			id: 'bounty_2',
			projectId: 'proj_awesome',
			title: 'Mobile responsive design',
			description: 'Improve mobile responsiveness and add touch gestures',
			skills: '["CSS","React","Mobile"]',
			amount: 300,
			priority: 'medium' as const,
			deadline: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
			status: 'open' as const,
			createdBy: 'user_alice'
		},
		{
			id: 'bounty_3',
			projectId: 'proj_ml_lib',
			title: 'Add model explainability',
			description: 'Implement SHAP values calculation for model predictions',
			skills: '["Python","Machine Learning","NumPy"]',
			amount: 800,
			priority: 'high' as const,
			deadline: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
			status: 'open' as const,
			createdBy: 'user_bob'
		},
		{
			id: 'bounty_4',
			projectId: 'proj_ml_lib',
			title: 'Optimize training speed',
			description: 'Add GPU acceleration support using CUDA',
			skills: '["Python","CUDA","Deep Learning"]',
			amount: 1200,
			priority: 'medium' as const,
			deadline: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
			status: 'open' as const,
			createdBy: 'user_bob'
		},
		{
			id: 'bounty_5',
			projectId: 'proj_defi_swap',
			title: 'Add limit orders',
			description: 'Implement limit order functionality for the DEX',
			skills: '["Solidity","TypeScript","Web3"]',
			amount: 1500,
			priority: 'high' as const,
			deadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
			status: 'open' as const,
			createdBy: 'user_carol'
		},
		{
			id: 'bounty_6',
			projectId: 'proj_defi_swap',
			title: 'Improve gas efficiency',
			description: 'Optimize contract gas usage and reduce transaction costs',
			skills: '["Solidity","Gas Optimization"]',
			amount: 2000,
			priority: 'high' as const,
			deadline: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
			status: 'open' as const,
			createdBy: 'user_carol'
		},
		{
			id: 'bounty_7',
			projectId: 'proj_cloud_cli',
			title: 'AWS provider support',
			description: 'Add AWS as a cloud provider with full resource management',
			skills: '["Go","AWS SDK","CLI"]',
			amount: 1000,
			priority: 'high' as const,
			deadline: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
			status: 'open' as const,
			createdBy: 'user_dave'
		},
		{
			id: 'bounty_8',
			projectId: 'proj_cloud_cli',
			title: 'Terraform export',
			description: 'Add functionality to export current state to Terraform',
			skills: '["Go","Terraform","HCL"]',
			amount: 600,
			priority: 'medium' as const,
			deadline: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
			status: 'open' as const,
			createdBy: 'user_dave'
		},
		{
			id: 'bounty_9',
			projectId: 'proj_mobile_app',
			title: 'iOS biometric auth',
			description: 'Implement Face ID and Touch ID authentication for iOS',
			skills: '["React Native","iOS","Biometrics"]',
			amount: 750,
			priority: 'high' as const,
			deadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
			status: 'open' as const,
			createdBy: 'user_carol'
		}
	];

	for (const b of bountyData) {
		await db.insert(schema.bounties).values({ ...b, createdAt: now });
	}
	console.log(`Created ${bountyData.length} bounties`);

	// Create bounty contributions
	const contributions = [
		{ id: 'contrib_1', bountyId: 'bounty_1', userId: 'user_bob', amount: 200 },
		{ id: 'contrib_2', bountyId: 'bounty_1', userId: 'user_carol', amount: 300 },
		{ id: 'contrib_3', bountyId: 'bounty_5', userId: 'user_dave', amount: 500 },
		{ id: 'contrib_4', bountyId: 'bounty_5', userId: 'user_alice', amount: 1000 }
	];

	for (const c of contributions) {
		await db.insert(schema.bountyContributions).values({ ...c, createdAt: now });
	}
	console.log(`Created ${contributions.length} contributions`);

	console.log('Seed complete!');
}

seed().catch((err) => {
	console.error('Seed failed:', err);
	process.exit(1);
});
