<script lang="ts">
	import { enhance } from '$app/forms';
	let { data } = $props();
	const { bounty, user } = data;
	const project = bounty.project;
</script>

<svelte:head>
	<title>{bounty.title} - OpenLink</title>
</svelte:head>

<div class="min-h-screen bg-gray-950">
	<header class="border-b border-gray-800">
		<nav class="container mx-auto px-4 py-4 flex items-center justify-between">
			<a href="/" class="text-xl font-bold text-white">OpenLink</a>
			<div class="flex items-center gap-4">
				<a href="/explore" class="text-gray-300 hover:text-white transition-colors">Explore</a>
				{#if user}
					<a href="/dashboard" class="text-gray-300 hover:text-white transition-colors">Dashboard</a>
				{:else}
					<a href="/login" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">Sign In</a>
				{/if}
			</div>
		</nav>
	</header>

	<main class="container mx-auto px-4 py-8 max-w-4xl">
		<div class="mb-6">
			<a href="/project/{project.id}" class="text-blue-400 hover:text-blue-300 text-sm">
				← Back to {project.name}
			</a>
		</div>

		<div class="grid lg:grid-cols-3 gap-8">
			<div class="lg:col-span-2">
				<div class="flex items-start justify-between mb-4">
					<h1 class="text-3xl font-bold text-white">{bounty.title}</h1>
					<span class="px-3 py-1 text-sm rounded-full 
						{bounty.status === 'open' ? 'bg-green-900/30 text-green-400' : 
						 bounty.status === 'in_progress' ? 'bg-yellow-900/30 text-yellow-400' :
						 bounty.status === 'completed' ? 'bg-blue-900/30 text-blue-400' :
						 'bg-purple-900/30 text-purple-400'}">
						{bounty.status.replace('_', ' ')}
					</span>
				</div>

				<div class="mb-6">
					<span class="text-4xl font-bold text-green-400">${(bounty.amount / 100).toFixed(2)}</span>
				</div>

				{#if bounty.description}
					<div class="prose prose-invert max-w-none mb-8">
						<h2 class="text-xl font-semibold text-white mb-3">Description</h2>
						<p class="text-gray-300 whitespace-pre-wrap">{bounty.description}</p>
					</div>
				{/if}

				{#if user && bounty.status === 'open'}
					<form method="POST" action="?/claim" use:enhance>
						<button type="submit" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
							Claim This Bounty
						</button>
					</form>
					<p class="mt-2 text-sm text-gray-500">Claim this bounty to start working on it.</p>
				{/if}

				{#if user && bounty.status === 'in_progress' && user.id === bounty.assignedTo}
					<form method="POST" action="?/complete" use:enhance>
						<button type="submit" class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
							Mark as Complete
						</button>
					</form>
					<p class="mt-2 text-sm text-gray-500">Mark this bounty as complete to request payment.</p>
				{/if}
			</div>

			<div class="lg:col-span-1">
				<div class="p-6 bg-gray-900 rounded-xl border border-gray-800 sticky top-8">
					<h3 class="text-lg font-semibold text-white mb-4">Project</h3>
					<a href="/project/{project.id}" class="block">
						<p class="text-white hover:text-blue-400 font-medium">{project.name}</p>
						<p class="text-sm text-gray-500">by {project.owner?.username}</p>
					</a>

					<div class="mt-6 pt-6 border-t border-gray-800">
						<h3 class="text-lg font-semibold text-white mb-4">Details</h3>
						<div class="space-y-3 text-sm">
							<div class="flex justify-between">
								<span class="text-gray-500">Status</span>
								<span class="text-gray-300 capitalize">{bounty.status.replace('_', ' ')}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-500">Amount</span>
								<span class="text-green-400 font-medium">${(bounty.amount / 100).toFixed(2)}</span>
							</div>
							{#if bounty.createdAt}
								<div class="flex justify-between">
									<span class="text-gray-500">Created</span>
									<span class="text-gray-300">{new Date(bounty.createdAt).toLocaleDateString()}</span>
								</div>
							{/if}
							{#if bounty.assignedTo}
								<div class="flex justify-between">
									<span class="text-gray-500">Assigned to</span>
									<span class="text-blue-400">Developer</span>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</div>
