<script lang="ts">
	import { type PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let user = $derived(data.user);
	let showOnboarding = $derived(data.showOnboarding || false);

	// Form state
	let companyName = $state('');
	let companyWebsite = $state('');
	let companyDescription = $state('');
	let message = $state('');
	let error = $state('');

	// Initialize form from user data
	$effect(() => {
		if (data.user) {
			companyName = data.user.companyName || '';
			companyWebsite = data.user.companyWebsite || '';
			companyDescription = data.user.companyDescription || '';
		}
	});

	async function handleSubmit() {
		try {
			const response = await fetch('/api/sponsor/profile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					companyName,
					companyWebsite,
					companyDescription
				})
			});

			const result = await response.json();

			if (!result.success) {
				error = result.message || 'Update failed';
				return;
			}

			message = 'Profile updated successfully';
			setTimeout(() => (message = ''), 3000);
		} catch (e) {
			error = 'Update failed';
		}
	}

	function dismissOnboarding() {
		showOnboarding = false;
	}
</script>

<div class="profile-container">
	<h1>Sponsor Profile</h1>

	{#if showOnboarding}
		<div class="onboarding-modal">
			<div class="modal-content">
				<h2>Welcome, Sponsor!</h2>
				<p>Complete your sponsor profile to start posting bounties.</p>

				<div class="safety-checklist">
					<h3>Safety Checklist</h3>
					<ul>
						<li>✓ Add your company name</li>
						<li>✓ Provide company website (optional)</li>
						<li>✓ Describe your company</li>
					</ul>
				</div>

				<button onclick={dismissOnboarding} class="dismiss-btn">Skip for now</button>
			</div>
		</div>
	{/if}

	{#if message}
		<p class="success">{message}</p>
	{/if}
	{#if error}
		<p class="error">{error}</p>
	{/if}

	<form onsubmit={handleSubmit}>
		<div>
			<label for="companyName">Company Name *</label>
			<input id="companyName" name="companyName" bind:value={companyName} type="text" required />
		</div>

		<div>
			<label for="companyWebsite">Company Website</label>
			<input id="companyWebsite" name="companyWebsite" bind:value={companyWebsite} type="url" placeholder="https://..." />
		</div>

		<div>
			<label for="companyDescription">Company Description</label>
			<textarea id="companyDescription" name="companyDescription" bind:value={companyDescription} rows="4"></textarea>
		</div>

		<button type="submit">Save Profile</button>
	</form>
</div>

<style>
	.profile-container {
		max-width: 600px;
		margin: 2rem auto;
		padding: 2rem;
	}

	.onboarding-modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
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
		width: 90%;
	}

	.safety-checklist {
		margin: 1rem 0;
		padding: 1rem;
		background: #f5f5f5;
		border-radius: 4px;
	}

	.success {
		color: green;
		padding: 0.5rem;
		background: #efe;
		border-radius: 4px;
	}

	.error {
		color: red;
		padding: 0.5rem;
		background: #fee;
		border-radius: 4px;
	}

	.dismiss-btn {
		background: transparent;
		border: 1px solid #ccc;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		margin-top: 1rem;
	}

	form div {
		margin-bottom: 1rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: bold;
	}

	input, textarea {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	button[type='submit'] {
		background: #0070f3;
		color: white;
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
</style>
