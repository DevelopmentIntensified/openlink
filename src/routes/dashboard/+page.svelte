<script lang="ts">
	import { enhance } from '$app/forms';
	let { data } = $props();
</script>

<svelte:head>
	<title>Dashboard - OpenLink</title>
</svelte:head>

<div class="min-h-screen bg-gray-950">
	<header class="border-b border-gray-800">
		<nav class="container mx-auto px-4 py-4 flex items-center justify-between">
			<a href="/" class="text-xl font-bold text-white">OpenLink</a>
			<div class="flex items-center gap-4">
				<a href="/explore" class="text-gray-300 hover:text-white transition-colors">Explore</a>
				<a href="/dashboard" class="text-blue-400 hover:text-blue-300 transition-colors">Dashboard</a>
				<a href="/profile/{data.user?.username}" class="text-gray-300 hover:text-white transition-colors">Profile</a>
				<form method="POST" action="/logout" use:enhance>
					<button type="submit" class="text-gray-300 hover:text-white transition-colors">Logout</button>
				</form>
			</div>
		</nav>
	</header>

	<main class="container mx-auto px-4 py-8">
		<div class="flex items-center justify-between mb-8">
			<div>
				<h1 class="text-3xl font-bold text-white">Dashboard</h1>
				<p class="text-gray-400 mt-1">Welcome back, {data.user?.username}!</p>
			</div>
			<a href="/dashboard/project/new" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
				New Project
			</a>
		</div>

		<h2 class="text-xl font-semibold text-white mb-4">Your Projects</h2>
		
		{#if data.projects.length === 0}
			<div class="text-center py-12 bg-gray-900 rounded-xl border border-gray-800">
				<p class="text-gray-400 text-lg mb-4">You haven't created any projects yet.</p>
				<a href="/dashboard/project/new" class="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
					Create Your First Project
				</a>
			</div>
		{:else}
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each data.projects as project}
					<div class="p-6 bg-gray-900 rounded-xl border border-gray-800">
						<div class="flex items-start justify-between mb-2">
							<h3 class="text-lg font-semibold text-white">{project.name}</h3>
							<span class="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-300 capitalize">
								{project.type}
							</span>
						</div>
						<p class="text-gray-400 text-sm mb-4 line-clamp-2">
							{project.description || 'No description'}
						</p>
						<div class="flex items-center justify-between">
							{#if project.isBountyEnabled}
								<span class="text-green-400 text-sm">Bounties enabled</span>
							{:else}
								<span class="text-gray-500 text-sm">No bounties</span>
							{/if}
							<div class="flex gap-2">
								<a href="/project/{project.id}" class="text-blue-400 hover:text-blue-300 text-sm">View</a>
								<a href="/dashboard/project/{project.id}/edit" class="text-gray-400 hover:text-white text-sm">Edit</a>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</main>
</div>
