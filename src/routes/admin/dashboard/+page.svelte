<script lang="ts">
	import type { UserWithRoles } from '$lib/server/rbac';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let user = $derived(data.user as UserWithRoles);
	let isAdmin = $derived(data.user?.roles?.includes('admin') || false);
</script>

<div class="dashboard">
	<h1>Admin Dashboard</h1>
	<p>Welcome, {user?.name || 'Admin'}!</p>

	{#if !isAdmin}
		<p class="error">Access denied. Admin role required.</p>
	{:else}
		<div class="dashboard-grid">
			<section class="card">
				<h2>User Management</h2>
				<p>Manage user roles and permissions</p>
				<a href="/admin/users" class="btn">Manage Users</a>
			</section>

			<section class="card">
				<h2>System Stats</h2>
				<p>View platform statistics</p>
				<a href="/admin/stats" class="btn">View Stats</a>
			</section>

			<section class="card">
				<h2>Content Moderation</h2>
				<p>Review reported content</p>
				<a href="/admin/moderation" class="btn">Moderate</a>
			</section>

			<section class="card">
				<h2>Settings</h2>
				<p>Configure system settings</p>
				<a href="/admin/settings" class="btn">Settings</a>
			</section>
		</div>
	{/if}
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
	.error {
		color: red;
		padding: 1rem;
		background: #fee;
		border-radius: 4px;
	}
</style>
