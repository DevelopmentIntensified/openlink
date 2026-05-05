<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props();
	let project = $derived(data.project);

	let errors = $state<Record<string, string>>({});

	// Form state - initialize from project prop
	let name = $state(project?.name || '');
	let description = $state(project?.description || '');
	let repoUrl = $state(project?.repoUrl || '');
	let website = $state(project?.website || '');
	let category = $state(project?.category || 'other');
	let type = $state<'community' | 'team' | 'individual'>(project?.type || 'individual');
	let isBountyEnabled = $state(project?.isBountyEnabled || false);
</script>

{#if project}
	<div class="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-8 px-4">
		<div class="max-w-2xl mx-auto">
			<!-- Header -->
			<div class="mb-8">
				<a href="/dashboard/project/{project.id}" class="text-amber-600 hover:text-amber-700 inline-flex items-center gap-2 mb-4">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
					Back to Project
				</a>

				<h1 class="text-4xl font-bold text-gray-900 mb-2">Edit Project</h1>
				<p class="text-lg text-gray-600">Update your project details</p>
			</div>

			<!-- Form -->
			<form method="POST" class="card p-8 space-y-6">
				<!-- Name -->
				<div>
					<label for="name" class="label">Project Name *</label>
					<input
						id="name"
						name="name"
						type="text"
						bind:value={name}
						class="input"
						placeholder="My Awesome Project"
						required
					/>
					{#if errors.name}
						<p class="text-red-600 text-sm mt-1">{errors.name}</p>
					{/if}
				</div>

				<!-- Description -->
				<div>
					<label for="description" class="label">Description</label>
					<textarea
						id="description"
						name="description"
						bind:value={description}
						class="input"
						rows="4"
						placeholder="Describe your project..."
					></textarea>
				</div>

				<!-- URLs -->
				<div class="grid md:grid-cols-2 gap-4">
					<div>
						<label for="repoUrl" class="label">Repository URL</label>
						<input
							id="repoUrl"
							name="repoUrl"
							type="url"
							bind:value={repoUrl}
							class="input"
							placeholder="https://github.com/..."
						/>
					</div>

					<div>
						<label for="website" class="label">Website</label>
						<input
							id="website"
							name="website"
							type="url"
							bind:value={website}
							class="input"
							placeholder="https://..."
						/>
					</div>
				</div>

				<!-- Category -->
				<div>
					<label for="category" class="label">Category</label>
					<select id="category" name="category" bind:value={category} class="input">
						<option value="web">Web</option>
						<option value="mobile">Mobile</option>
						<option value="desktop">Desktop</option>
						<option value="backend">Backend</option>
						<option value="devops">DevOps</option>
						<option value="data">Data</option>
						<option value="security">Security</option>
						<option value="other">Other</option>
					</select>
				</div>

				<!-- Type -->
				<div>
					<label for="type" class="label">Project Type</label>
					<select id="type" name="type" bind:value={type} class="input">
						<option value="individual">Individual</option>
						<option value="community">Community</option>
						<option value="team">Team</option>
					</select>
				</div>

				<!-- Bounty Enabled -->
				<div class="flex items-center gap-3">
					<input
						id="isBountyEnabled"
						name="isBountyEnabled"
						type="checkbox"
						bind:checked={isBountyEnabled}
						class="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
					/>
					<label for="isBountyEnabled" class="text-gray-700">
						Enable bounties for this project
					</label>
				</div>

				<!-- Submit -->
				<div class="flex items-center justify-between pt-4 border-t border-gray-100">
					<a href="/dashboard/project/{project.id}" class="text-gray-600 hover:text-gray-900 transition-colors">
						Cancel
					</a>
					<button type="submit" class="btn-primary-gradient btn-lift">
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
						Save Changes
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
