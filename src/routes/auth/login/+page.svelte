<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let showRoleSelection = $state(false);
	let userRoles: string[] = $state([]);

	async function handleLogin() {
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});

			const result = await response.json();

			if (!result.success) {
				error = result.message || 'Login failed';
				return;
			}

			// Check if user has multiple roles
			userRoles = result.roles || ['dev'];

			if (userRoles.length > 1 && userRoles.includes('dev') && userRoles.includes('sponsor')) {
				// Show role selection for dual-role users
				showRoleSelection = true;
			} else {
				// Single role or no conflict - redirect to default dashboard
				const defaultRole = userRoles.includes('dev') ? 'dev' : 'sponsor';
				goto(`/${defaultRole}/dashboard`);
			}
		} catch (e) {
			error = 'Login failed';
		}
	}

	function selectRole(role: string) {
		goto(`/${role}/dashboard`);
	}
</script>

<div class="login-container">
	<h1>Login to BountyForge</h1>

	{#if !showRoleSelection}
		<form onsubmit={handleLogin}>
			<div>
				<label for="email">Email</label>
				<input id="email" bind:value={email} type="email" required />
			</div>
			<div>
				<label for="password">Password</label>
				<input id="password" bind:value={password} type="password" required />
			</div>
			{#if error}
				<p class="error">{error}</p>
			{/if}
			<button type="submit">Log in</button>
		</form>
		<p>Don't have an account? <a href="/dev/signup">Sign up as Dev</a> or <a href="/sponsor/signup">Sign up as Sponsor</a></p>
	{:else}
		<div class="role-selection">
			<h2>Select your role</h2>
			<p>You have multiple roles. Which dashboard do you want to access?</p>
			{#if userRoles.includes('dev')}
				<button onclick={() => selectRole('dev')}>Continue as Developer</button>
			{/if}
			{#if userRoles.includes('sponsor')}
				<button onclick={() => selectRole('sponsor')}>Continue as Sponsor</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.login-container {
		max-width: 400px;
		margin: 2rem auto;
		padding: 2rem;
	}
	.role-selection {
		text-align: center;
	}
	.error {
		color: red;
	}
	button {
		margin: 0.5rem;
		padding: 0.75rem 1.5rem;
	}
</style>
