<script lang="ts">
	import type { UserWithRoles } from '$lib/server/rbac';
	import { getRoles, getOnboardingStatus } from '$lib/server/rbac';
	import { shouldShowOnboarding } from '$lib/server/dev/profile-logic';

	export let data: { user: UserWithRoles };

	$: user = data.user;
	$: roles = user ? getRoles(user) : [];
	$: hasProjects = roles.includes('dev'); // Dev role has projects
	$: showOnboarding = user ? shouldShowOnboarding(user) : false;

	function dismissOnboarding() {
		showOnboarding = false;
		// TODO: Call API to set onboardingComplete=true if user fills profile
	}
</script>

<div class="dashboard">
	<h1>Developer Dashboard</h1>
	<p>Welcome, {user?.name || 'Developer'}!</p>

	{#if showOnboarding}
		<div class="onboarding-modal">
			<div class="modal-content">
				<h2>Complete Your Profile</h2>
				<p>Add your bio, GitHub profile, and skills to get started.</p>
				<p><a href="/dev/profile" class="btn">Complete Profile</a></p>
				<button on:click={dismissOnboarding} class="skip-btn">Skip for now</button>
			</div>
		</div>
	{/if}

	<div class="dashboard-grid">
		<section class="card">
			<h2>My Bounties</h2>
			<p>View and claim bounties</p>
			<a href="/dev/bounties" class="btn">View Bounties</a>
		</section>

		{#if hasProjects}
			<section class="card">
				<h2>My Projects</h2>
				<p>Manage your projects and devteams</p>
				<a href="/dev/projects" class="btn">View Projects</a>
			</section>
		{/if}

		<section class="card">
			<h2>Profile</h2>
			<p>Update your skills and profile</p>
			<a href="/dev/profile" class="btn">Edit Profile</a>
		</section>

		<section class="card">
			<h2>Teams</h2>
			<p>Manage your devteams</p>
			<a href="/dev/teams" class="btn">View Teams</a>
		</section>
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
	.onboarding-modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0,0,0,0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}
	.modal-content {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		max-width: 500px;
	}
	.skip-btn {
		background: none;
		border: none;
		color: #666;
		cursor: pointer;
		margin-top: 1rem;
	}
</style>
