<script lang="ts">
	import { type PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let user = $derived(data.user);
	let roles = $derived(data.roles || []);
	let isSponsor = $derived(data.isSponsor || false);
	let projects = $derived(data.projects || []);
	let bountyCount = $derived(data.bountyCount || 0);
</script>

<div class="dashboard">
	<h1>Sponsor Dashboard</h1>
	<p>Welcome, {user?.name || 'Sponsor'}!</p>

	{#if !isSponsor}
		<p class="error">Access denied. Sponsor role required.</p>
	{:else}
		<div class="stats-grid">
			<div class="stat-card">
				<h3>Projects</h3>
				<p class="stat-number">{projects.length}</p>
				<a href="/sponsor/projects" class="btn">Manage Projects</a>
			</div>

			<div class="stat-card">
				<h3>Active Bounties</h3>
				<p class="stat-number">{bountyCount}</p>
				<a href="/sponsor/bounties" class="btn">View Bounties</a>
			</div>

			<div class="stat-card">
				<h3>Profile</h3>
				<p class="stat-detail">Complete your sponsor profile</p>
				<a href="/sponsor/profile" class="btn">Edit Profile</a>
			</div>
		</div>

		<div class="quick-actions">
			<h2>Quick Actions</h2>
			<div class="action-buttons">
				<a href="/sponsor/bounties/post" class="btn-primary">Post New Bounty</a>
				<a href="/sponsor/projects/new" class="btn-secondary">Create Project</a>
			</div>
		</div>

		{#if projects.length > 0}
			<div class="projects-section">
				<h2>Your Projects</h2>
				<ul class="project-list">
					{#each projects as project}
						<li>
							<a href="/project/{project.id}">{project.name}</a>
							<span class="project-type">{project.type}</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	{/if}
</div>

<style>
	.dashboard {
		max-width: 1200px;
		margin: 2rem auto;
		padding: 2rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin: 2rem 0;
	}

	.stat-card {
		padding: 1.5rem;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		background: white;
		text-align: center;
	}

	.stat-number {
		font-size: 2rem;
		font-weight: bold;
		color: #0070f3;
		margin: 0.5rem 0;
	}

	.stat-detail {
		color: #666;
		font-size: 0.9rem;
	}

	.quick-actions {
		margin: 2rem 0;
		padding: 1.5rem;
		background: #f9f9f9;
		border-radius: 8px;
	}

	.action-buttons {
		display: flex;
		gap: 1rem;
		margin-top: 1rem;
	}

	.btn {
		display: inline-block;
		margin-top: 1rem;
		padding: 0.5rem 1rem;
		background: #0070f3;
		color: white;
		text-decoration: none;
		border-radius: 4px;
	}

	.btn-primary {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: #0070f3;
		color: white;
		text-decoration: none;
		border-radius: 4px;
		font-weight: bold;
	}

	.btn-secondary {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: white;
		color: #0070f3;
		text-decoration: none;
		border: 2px solid #0070f3;
		border-radius: 4px;
		font-weight: bold;
	}

	.projects-section {
		margin-top: 2rem;
	}

	.project-list {
		list-style: none;
		padding: 0;
	}

	.project-list li {
		padding: 1rem;
		border: 1px solid #e0e0e0;
		border-radius: 4px;
		margin-bottom: 0.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.project-type {
		font-size: 0.8rem;
		padding: 0.25rem 0.5rem;
		background: #e0e0e0;
		border-radius: 4px;
	}

	.error {
		color: red;
		padding: 1rem;
		background: #fee;
		border-radius: 4px;
	}
</style>
