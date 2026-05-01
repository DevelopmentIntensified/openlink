<script lang="ts">
	import { type PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let user = $derived(data.user);
	let roles = $derived(data.roles || []);
	let isSponsor = $derived(data.isSponsor || false);
</script>

<div class="dashboard">
	<h1>Sponsor Dashboard</h1>
	<p>Welcome, {user?.name || 'Sponsor'}!</p>

	<div class="dashboard-grid">
		<section class="card">
			<h2>My Bounties</h2>
			<p>Post and manage bounties</p>
			<a href="/sponsor/bounties" class="btn">Manage Bounties</a>
		</section>

		<section class="card">
			<h2>Post New Bounty</h2>
			<p>Fund a feature you need</p>
			<a href="/sponsor/bounties/post" class="btn">Post Bounty</a>
		</section>

		{#if isSponsor}
			<section class="card">
				<h2>Analytics</h2>
				<p>Track your bounty performance</p>
				<a href="/sponsor/analytics" class="btn">View Analytics</a>
			</section>
		{/if}
	</div>
</div>

<style>
	.dashboard {
		max-width: 1200px;
		margin: 2rem auto;
		padding: 2rem;
	}
	.dashboard-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-top: 2rem;
	}
	.card {
		padding: 1.5rem;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		background: white;
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
</style>
