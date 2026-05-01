<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	let { data }: { data: PageData } = $props();

	let name = $state('');
	let description = $state('');
	let repoUrl = $state('');
	let website = $state('');
	let category = $state('other');
	let type = $state('individual');
	let isBountyEnabled = $state(false);
	let message = $state('');

	let categories = ['web', 'mobile', 'desktop', 'backend', 'devops', 'data', 'security', 'other'];
	let types = ['individual', 'team', 'community'];
</script>

<div class="container">
	<h1>Create New Project</h1>

	{#if data.user}
		<form method="POST" use:enhance class="form">
			<div class="form-group">
				<label for="name">Project Name *</label>
				<input type="text" id="name" name="name" bind:value={name} required />
			</div>

			<div class="form-group">
				<label for="description">Description</label>
				<textarea id="description" name="description" bind:value={description} rows="3"></textarea>
			</div>

			<div class="form-group">
				<label for="repoUrl">Repository URL</label>
				<input type="url" id="repoUrl" name="repoUrl" bind:value={repoUrl} placeholder="https://github.com/..." />
			</div>

			<div class="form-group">
				<label for="website">Website</label>
				<input type="url" id="website" name="website" bind:value={website} placeholder="https://..." />
			</div>

			<div class="form-group">
				<label for="category">Category</label>
				<select id="category" name="category" bind:value={category}>
					{#each categories as cat}
						<option value={cat}>{cat}</option>
					{/each}
				</select>
			</div>

			<div class="form-group">
				<label for="type">Project Type</label>
				<select id="type" name="type" bind:value={type}>
					{#each types as t}
						<option value={t}>{t}</option>
					{/each}
				</select>
			</div>

			<div class="form-group checkbox">
				<label>
					<input type="checkbox" name="isBountyEnabled" bind:checked={isBountyEnabled} />
					Enable Bounties for this project
				</label>
			</div>

			<button type="submit" class="btn-primary">Create Project</button>

			{#if message}
				<p class="message">{message}</p>
			{/if}
		</form>
	{:else}
		<p>Please <a href="/login">login</a> to create a project.</p>
	{/if}
</div>

<style>
	.container {
		max-width: 800px;
		margin: 2rem auto;
		padding: 2rem;
	}
	.form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.checkbox {
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
	}
	input,
	textarea,
	select {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}
	.btn-primary {
		padding: 0.75rem 1.5rem;
		background: #0070f3;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		width: fit-content;
	}
	.btn-primary:hover {
		background: #0051cc;
	}
	.message {
		padding: 1rem;
		background: #e8f5e9;
		border-radius: 4px;
		margin-top: 1rem;
	}
</style>
