<script lang="ts">
	import { enhance } from '$app/forms';
	let { data, form } = $props();
</script>

<svelte:head>
	<title>Edit {data.project.name} - OpenLink</title>
</svelte:head>

<div class="min-h-screen bg-gray-950">
	<header class="border-b border-gray-800">
		<nav class="container mx-auto px-4 py-4 flex items-center justify-between">
			<a href="/" class="text-xl font-bold text-white">OpenLink</a>
			<div class="flex items-center gap-4">
				<a href="/explore" class="text-gray-300 hover:text-white transition-colors">Explore</a>
				<a href="/dashboard" class="text-blue-400 hover:text-blue-300 transition-colors">Dashboard</a>
			</div>
		</nav>
	</header>

	<main class="container mx-auto px-4 py-8 max-w-2xl">
		<h1 class="text-3xl font-bold text-white mb-8">Edit Project</h1>

		<form method="POST" use:enhance class="space-y-6">
			{#if form?.error}
				<div class="p-4 text-sm text-red-400 bg-red-900/20 rounded-lg border border-red-800">
					{form.error}
				</div>
			{/if}

			<div>
				<label for="name" class="block text-sm font-medium text-gray-300 mb-2">
					Project Name *
				</label>
				<input
					type="text"
					id="name"
					name="name"
					required
					value={data.project.name}
					class="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600"
				/>
			</div>

			<div>
				<label for="description" class="block text-sm font-medium text-gray-300 mb-2">
					Description
				</label>
				<textarea
					id="description"
					name="description"
					rows="4"
					class="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600"
				>{data.project.description || ''}</textarea>
			</div>

			<div>
				<label for="type" class="block text-sm font-medium text-gray-300 mb-2">
					Project Type *
				</label>
				<select
					id="type"
					name="type"
					required
					value={data.project.type}
					class="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-600"
				>
					<option value="individual">Individual</option>
					<option value="team">Team</option>
					<option value="community">Community</option>
				</select>
			</div>

			<div>
				<label for="repoUrl" class="block text-sm font-medium text-gray-300 mb-2">
					Repository URL
				</label>
				<input
					type="url"
					id="repoUrl"
					name="repoUrl"
					value={data.project.repoUrl || ''}
					class="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600"
				/>
			</div>

			<div>
				<label for="website" class="block text-sm font-medium text-gray-300 mb-2">
					Project Website
				</label>
				<input
					type="url"
					id="website"
					name="website"
					value={data.project.website || ''}
					class="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600"
				/>
			</div>

			<div class="flex items-center gap-3">
				<input
					type="checkbox"
					id="isBountyEnabled"
					name="isBountyEnabled"
					checked={data.project.isBountyEnabled}
					class="w-4 h-4 bg-gray-900 border border-gray-700 rounded text-blue-600 focus:ring-blue-600"
				/>
				<label for="isBountyEnabled" class="text-sm text-gray-300">
					Enable bounty program for this project
				</label>
			</div>

			<div class="flex gap-4 pt-4">
				<a href="/dashboard" class="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
					Cancel
				</a>
				<button type="submit" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
					Save Changes
				</button>
			</div>
		</form>
	</main>
</div>
