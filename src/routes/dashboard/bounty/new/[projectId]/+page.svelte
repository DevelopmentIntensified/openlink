<script lang="ts">
	import { enhance } from '$app/forms';
	let { data, form } = $props();
</script>

<svelte:head>
	<title>New Bounty - OpenLink</title>
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
		<div class="mb-6">
			<a href="/project/{data.project.id}" class="text-blue-400 hover:text-blue-300 text-sm">
				← Back to {data.project.name}
			</a>
		</div>

		<h1 class="text-3xl font-bold text-white mb-2">Create Bounty</h1>
		<p class="text-gray-400 mb-8">for {data.project.name}</p>

		<form method="POST" use:enhance class="space-y-6">
			{#if form?.error}
				<div class="p-4 text-sm text-red-400 bg-red-900/20 rounded-lg border border-red-800">
					{form.error}
				</div>
			{/if}

			<div>
				<label for="title" class="block text-sm font-medium text-gray-300 mb-2">
					Title *
				</label>
				<input
					type="text"
					id="title"
					name="title"
					required
					class="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600"
					placeholder="Add feature X to the project"
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
					placeholder="Describe what you want built or fixed..."
				></textarea>
			</div>

			<div>
				<label for="amount" class="block text-sm font-medium text-gray-300 mb-2">
					Bounty Amount (USD) *
				</label>
				<div class="relative">
					<span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
					<input
						type="number"
						id="amount"
						name="amount"
						required
						min="1"
						step="0.01"
						class="w-full pl-8 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600"
						placeholder="100.00"
					/>
				</div>
				<p class="mt-1 text-sm text-gray-500">
					Minimum $1.00. This will be paid to the developer who completes this bounty.
				</p>
			</div>

			<div class="flex gap-4 pt-4">
				<a href="/project/{data.project.id}" class="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
					Cancel
				</a>
				<button type="submit" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
					Create Bounty
				</button>
			</div>
		</form>
	</main>
</div>
