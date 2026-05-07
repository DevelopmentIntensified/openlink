<script lang="ts">
	import { type PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let user = $derived(data.user);
	let roles = $derived(data.roles || []);

	// Initialize state
	let bio = $state('');
	let skills = $state<string[]>([]);
	let githubUrl = $state('');
	let newSkill = $state('');
	let message = $state('');
	let error = $state('');

	// Set initial values from user data
	$effect(() => {
		if (data.user) {
			bio = data.user.bio || '';
			skills = data.user.skills || [];
			githubUrl = data.user.githubUrl || '';
		}
	});

	// Update githubUrl when user data changes
	$effect(() => {
		if (data.user?.githubUrl) {
			githubUrl = data.user.githubUrl;
		}
	});

	// Update skills when user data changes
	$effect(() => {
		if (data.user?.skills) {
			skills = data.user.skills;
		}
	});

	// Update bio when user data changes
	$effect(() => {
		if (data.user?.bio) {
			bio = data.user.bio;
		}
	});

	function addSkill() {
		if (newSkill.trim() && !skills.includes(newSkill.trim())) {
			skills = [...skills, newSkill.trim()];
			newSkill = '';
		}
	}

	function removeSkill(skill: string) {
		skills = skills.filter(s => s !== skill);
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		message = '';
		error = '';

		try {
			const response = await fetch('?/updateProfile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ bio, githubUrl, skills })
			});

			if (response.ok) {
				message = 'Profile updated successfully!';
			} else {
				const data = await response.json();
				error = data.error || 'Failed to update profile';
			}
		} catch (e) {
			error = 'An error occurred while saving your profile';
		}
	}
</script>

<div class="profile-container">
	<h1>Edit Profile</h1>

	{#if message}
		<div class="success">{message}</div>
	{/if}
	{#if error}
		<div class="error">{error}</div>
	{/if}

	<form onsubmit={handleSubmit}>
		<div class="form-group">
			<label for="bio">Bio</label>
			<textarea id="bio" bind:value={bio} rows="4" placeholder="Tell us about yourself..."></textarea>
		</div>

		<div class="form-group">
			<label for="githubUrl">GitHub Profile URL</label>
			<input id="githubUrl" bind:value={githubUrl} type="url" placeholder="https://github.com/yourusername" />
		</div>

		<div class="form-group">
			<label for="skills">Skills</label>
			<div class="skill-input">
				<input id="skills" bind:value={newSkill} type="text" placeholder="Add a skill..." onkeydown={(e) => e.key === 'Enter' && addSkill()} />
				<button type="button" onclick={addSkill}>Add</button>
			</div>
			<div class="skill-list">
				{#each skills as skill}
					<span class="skill-tag">
						{skill}
						<button type="button" onclick={() => removeSkill(skill)}>×</button>
					</span>
				{/each}
			</div>
		</div>

		<button type="submit" class="btn">Save Profile</button>
	</form>

	<div class="current-roles">
		<h3>Your Roles</h3>
		<p>{roles.join(', ')}</p>
	</div>

	<a href="/dev/dashboard" class="back-link">← Back to Dashboard</a>
</div>

<style>
	.profile-container {
		max-width: 600px;
		margin: 2rem auto;
		padding: 2rem;
	}
	.form-group {
		margin-bottom: 1.5rem;
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
		font-size: 1rem;
	}
	.skill-input {
		display: flex;
		gap: 0.5rem;
	}
	.skill-input input {
		flex: 1;
	}
	.skill-input button {
		padding: 0.5rem 1rem;
		background: #0070f3;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
	.skill-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}
	.skill-tag {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem 0.75rem;
		background: #e3f2fd;
		border-radius: 20px;
		font-size: 0.875rem;
	}
	.skill-tag button {
		background: none;
		border: none;
		color: #666;
		cursor: pointer;
		padding: 0;
		font-size: 1.25rem;
	}
	.btn {
		padding: 0.75rem 1.5rem;
		background: #0070f3;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
	}
	.success {
		padding: 1rem;
		background: #d4edda;
		color: #155724;
		border-radius: 4px;
		margin-bottom: 1rem;
	}
	.error {
		padding: 1rem;
		background: #f8d7da;
		color: #721c24;
		border-radius: 4px;
		margin-bottom: 1rem;
	}
	.current-roles {
		margin-top: 2rem;
		padding: 1rem;
		background: #f9f9f9;
		border-radius: 4px;
	}
	.back-link {
		display: inline-block;
		margin-top: 1rem;
		color: #0070f3;
		text-decoration: none;
	}
</style>
