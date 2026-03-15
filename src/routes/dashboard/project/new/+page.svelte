<script lang="ts">
	import { enhance } from '$app/forms';
	
	let { data } = $props();
	let loading = $state(false);
</script>

<div class="max-w-2xl mx-auto">
	<div class="mb-8">
		<a href="/dashboard" class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
			<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back to Dashboard
		</a>
		<h1 class="text-2xl font-bold text-gray-900 mt-2">Create New Project</h1>
		<p class="text-gray-500 mt-1">Set up your open source project to start receiving contributions</p>
	</div>
	
	<form method="POST" use:enhance={() => {
		loading = true;
		return async ({ update }) => {
			await update();
			loading = false;
		};
	}} class="card p-6 space-y-6">
		<div>
			<label for="name" class="block text-sm font-medium text-gray-700 mb-1.5">
				Project Name <span class="text-red-500">*</span>
			</label>
			<input
				type="text"
				id="name"
				name="name"
				required
				class="input"
				placeholder="My Awesome Project"
			/>
		</div>
		
		<div>
			<label for="description" class="block text-sm font-medium text-gray-700 mb-1.5">
				Description
			</label>
			<textarea
				id="description"
				name="description"
				rows="4"
				class="input resize-none"
				placeholder="Describe your project and what it does..."
			></textarea>
		</div>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label for="repoUrl" class="block text-sm font-medium text-gray-700 mb-1.5">
					Repository URL
				</label>
				<input
					type="url"
					id="repoUrl"
					name="repoUrl"
					class="input"
					placeholder="https://github.com/username/repo"
				/>
			</div>
			
			<div>
				<label for="website" class="block text-sm font-medium text-gray-700 mb-1.5">
					Website
				</label>
				<input
					type="url"
					id="website"
					name="website"
					class="input"
					placeholder="https://myproject.com"
				/>
			</div>
		</div>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label for="category" class="block text-sm font-medium text-gray-700 mb-1.5">
					Category
				</label>
				<select id="category" name="category" class="input">
					<option value="ai-ml">AI & Machine Learning</option>
					<option value="blockchain">Blockchain</option>
					<option value="cloud">Cloud & Infrastructure</option>
					<option value="database">Database</option>
					<option value="devtools">Developer Tools</option>
					<option value="gaming">Gaming</option>
					<option value="iot">IoT</option>
					<option value="mobile">Mobile</option>
					<option value="programming-lang">Programming Languages</option>
					<option value="security">Security</option>
					<option value="web">Web Development</option>
					<option value="other">Other</option>
				</select>
			</div>
			
			<div>
				<label for="type" class="block text-sm font-medium text-gray-700 mb-1.5">
					Project Type
				</label>
				<select id="type" name="type" class="input">
					<option value="individual">Individual</option>
					<option value="team">Team</option>
					<option value="community">Community</option>
				</select>
			</div>
		</div>
		
		<div class="border-t border-gray-200 pt-6">
			<div class="flex items-start">
				<div class="flex h-5 items-center">
					<input
						type="checkbox"
						id="isBountyEnabled"
						name="isBountyEnabled"
						class="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
					/>
				</div>
				<div class="ml-3 text-sm">
					<label for="isBountyEnabled" class="font-medium text-gray-700">
						Enable bounty program
					</label>
					<p class="text-gray-500">Allow contributors to fund and work on bounties for your project</p>
				</div>
			</div>
		</div>
		
		<div class="flex gap-3 pt-4">
			<a href="/dashboard" class="btn-ghost">
				Cancel
			</a>
			<button type="submit" disabled={loading} class="btn-primary">
				{#if loading}
					<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					Creating...
				{:else}
					Create Project
				{/if}
			</button>
		</div>
	</form>
</div>
