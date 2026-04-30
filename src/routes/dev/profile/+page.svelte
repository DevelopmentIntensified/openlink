<script lang="ts">
	import type { UserWithRoles } from '$lib/server/rbac';
	import { getRoles } from '$lib/server/rbac';
	import { prepareProfileUpdate } from '$lib/server/dev/profile-logic';

	export let data: { user: UserWithRoles };
	let bio = data.user?.bio || '';
	let skills = data.user?.skills ? JSON.parse(data.user.skills) : [];
	let githubUrl = data.user?.githubUrl || '';
	let newSkill = '';
	let message = '';
	let error = '';

	$: user = data.user;
	$: userRoles = user ? getRoles(user) : [];

	function addSkill() {
		if (newSkill.trim() && !skills.includes(newSkill.trim())) {
			skills = [...skills, newSkill.trim()];
			newSkill = '';
		}
	}

	function removeSkill(skill: string) {
		skills = skills.filter((s: string) => s !== skill);
	}

	async function handleSubmit() {
		const profileData = {
			bio,
			skills,
			githubUrl
		};

		const update = prepareProfileUpdate(profileData);

		try {
			const response = await fetch('/api/dev/profile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(update)
			});

			const result = await response.json();

			if (result.success) {
				message = 'Profile updated successfully!';
				error = '';
			} else {
				error = result.message || 'Failed to update profile';
				message = '';
			}
		} catch (e) {
			error = 'Failed to update profile';
			message = '';
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

	<form on:submit|preventDefault={handleSubmit}>
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
				<input id="skills" bind:value={newSkill} type="text" placeholder="Add a skill..." on:keydown={(e) => e.key === 'Enter' && addSkill()} />
				<button type="button" on:click={addSkill}>Add</button>
			</div>
			<div class="skill-list">
				{#each skills as skill}
					<span class="skill-tag">
						{skill}
						<button type="button" on:click={() => removeSkill(skill)}>×</button>
					</span>
				{/each}
			</div>
		</div>

		<button type="submit" class="btn">Save Profile</button>
	</form>

	<div class="current-roles">
		<h3>Your Roles</h3>
		<p>{userRoles.join(', ')}</p>
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
