<script lang="ts">
	import { getSignupRole } from '$lib/shared/signup-utils';
	import type { SignupData } from '$lib/shared/signup-utils';

	let email = $state('');
	let password = $state('');
	let name = $state('');
	let errors: string[] = $state([]);

	let role = $derived(getSignupRole('/dev/signup'));

	async function handleSubmit() {
		const data: SignupData = {
			email,
			password,
			name,
			role: role || 'dev'
		};

		const response = await fetch('/api/auth/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});

		const result = await response.json();

		if (!result.success) {
			errors = result.errors || ['Signup failed'];
		}
	}
</script>

<div class="signup-container">
	<h1>Sign up as Developer</h1>
	<form onsubmit={handleSubmit}>
		<div>
			<label for="name">Name</label>
			<input id="name" bind:value={name} type="text" required />
		</div>
		<div>
			<label for="email">Email</label>
			<input id="email" bind:value={email} type="email" required />
		</div>
		<div>
			<label for="password">Password</label>
			<input id="password" bind:value={password} type="password" minlength="8" required />
		</div>
		{#if errors.length > 0}
			<div class="errors">
				{#each errors as error}
					<p class="error">{error}</p>
				{/each}
			</div>
		{/if}
		<button type="submit">Sign up as Dev</button>
	</form>
	<p>Already have an account? <a href="/auth/login">Log in</a></p>
</div>

<style>
	.signup-container {
		max-width: 400px;
		margin: 2rem auto;
		padding: 2rem;
	}
	.errors {
		color: red;
		margin: 1rem 0;
	}
</style>
