<script lang="ts">
	import { enhance } from '$app/forms';
	
	let { data } = $props();
	let project = $derived(data.project);
	let loading = $state(false);
</script>

<div class="max-w-2xl mx-auto">
	<div class="mb-8">
		<a href="/project/{project.id}" class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
			<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back to Project
		</a>
		<h1 class="text-2xl font-bold text-gray-900 mt-2">Create Bounty</h1>
		<p class="text-gray-500 mt-1">for <span class="font-medium">{project.name}</span></p>
	</div>
	
	<form method="POST" use:enhance={() => {
		loading = true;
		return async ({ update }) => {
			await update();
			loading = false;
		};
	}} class="card p-6 space-y-6">
		<div>
			<label for="title" class="block text-sm font-medium text-gray-700 mb-1.5">
				Title <span class="text-red-500">*</span>
			</label>
			<input
				type="text"
				id="title"
				name="title"
				required
				class="input"
				placeholder="Fix authentication bug"
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
				placeholder="Describe what needs to be done..."
			></textarea>
		</div>
		
		<div>
			<label for="skills" class="block text-sm font-medium text-gray-700 mb-1.5">
				Required Skills
			</label>
			<input
				type="text"
				id="skills"
				name="skills"
				class="input"
				placeholder="JavaScript, React, Node.js (comma separated)"
			/>
		</div>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label for="amount" class="block text-sm font-medium text-gray-700 mb-1.5">
					Amount (USD) <span class="text-red-500">*</span>
				</label>
				<input
					type="number"
					id="amount"
					name="amount"
					required
					min="1"
					step="0.01"
					class="input"
					placeholder="100.00"
				/>
			</div>
			
			<div>
				<label for="priority" class="block text-sm font-medium text-gray-700 mb-1.5">
					Priority
				</label>
				<select id="priority" name="priority" class="input">
					<option value="low">Low</option>
					<option value="medium" selected>Medium</option>
					<option value="high">High</option>
					<option value="urgent">Urgent</option>
				</select>
			</div>
		</div>
		
		<div>
			<label for="deadline" class="block text-sm font-medium text-gray-700 mb-1.5">
				Deadline (optional)
			</label>
			<input
				type="date"
				id="deadline"
				name="deadline"
				class="input"
			/>
		</div>
		
		<div class="flex gap-3 pt-4">
			<a href="/project/{project.id}" class="btn-ghost">
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
					Create Bounty
				{/if}
			</button>
		</div>
	</form>
</div>
