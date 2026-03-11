<script lang="ts">
	let { data } = $props();
	const { project, bounties, user } = data;
</script>

<svelte:head>
	<title>{project.name} - OpenLink</title>
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

	<main class="container mx-auto px-4 py-8">
		<div class="grid lg:grid-cols-3 gap-8">
			<div class="lg:col-span-2">
				<div class="flex items-start justify-between mb-4">
					<div>
						<h1 class="text-3xl font-bold text-white">{project.name}</h1>
						<p class="text-gray-400 mt-1">by <a href="/profile/{project.owner?.username}" class="text-blue-400 hover:text-blue-300">{project.owner?.username}</a></p>
					</div>
					<span class="px-3 py-1 text-sm rounded-full bg-gray-800 text-gray-300 capitalize">
						{project.type}
					</span>
				</div>

				{#if project.description}
					<p class="text-gray-300 mb-6">{project.description}</p>
				{/if}

				<div class="flex gap-4 mb-8">
					{#if project.repoUrl}
						<a href={project.repoUrl} target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
							</svg>
							Repository
						</a>
					{/if}
					{#if project.website}
						<a href={project.website} target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
							</svg>
							Website
						</a>
					{/if}
				</div>

				<div class="border-t border-gray-800 pt-8">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-xl font-semibold text-white">Bounties</h2>
						{#if project.isBountyEnabled && user}
							<a href="/dashboard/bounty/new/{project.id}" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
								Create Bounty
							</a>
						{/if}
					</div>

					{#if !project.isBountyEnabled}
						<div class="p-4 bg-gray-900 rounded-lg border border-gray-800">
							<p class="text-gray-400">This project has not enabled the bounty program yet.</p>
						</div>
					{:else if bounties.length === 0}
						<div class="p-4 bg-gray-900 rounded-lg border border-gray-800">
							<p class="text-gray-400">No bounties yet. Be the first to create one!</p>
						</div>
					{:else}
						<div class="space-y-4">
							{#each bounties as bounty}
								<a href="/project/{project.id}/bounty/{bounty.id}" class="block p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-blue-600 transition-colors">
									<div class="flex items-start justify-between">
										<div>
											<h3 class="font-medium text-white">{bounty.title}</h3>
											<p class="text-sm text-gray-400 mt-1 line-clamp-2">{bounty.description || 'No description'}</p>
										</div>
										<span class="px-2 py-1 text-xs rounded-full 
											{bounty.status === 'open' ? 'bg-green-900/30 text-green-400' : 
											 bounty.status === 'in_progress' ? 'bg-yellow-900/30 text-yellow-400' :
											 bounty.status === 'completed' ? 'bg-blue-900/30 text-blue-400' :
											 'bg-purple-900/30 text-purple-400'}">
											{bounty.status.replace('_', ' ')}
										</span>
									</div>
									<div class="mt-3 flex items-center justify-between">
										<span class="text-lg font-semibold text-green-400">${(bounty.amount / 100).toFixed(2)}</span>
										<span class="text-sm text-gray-500">
											{bounty.createdAt ? new Date(bounty.createdAt).toLocaleDateString() : ''}
										</span>
									</div>
								</a>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<div class="lg:col-span-1">
				<div class="p-6 bg-gray-900 rounded-xl border border-gray-800 sticky top-8">
					<h3 class="text-lg font-semibold text-white mb-4">About</h3>
					<div class="space-y-3 text-sm">
						<div class="flex justify-between">
							<span class="text-gray-500">Type</span>
							<span class="text-gray-300 capitalize">{project.type}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-500">Bounties</span>
							<span class="text-gray-300">{bounties.length}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-500">Bounty Program</span>
							<span class="{project.isBountyEnabled ? 'text-green-400' : 'text-gray-500'}">
								{project.isBountyEnabled ? 'Enabled' : 'Disabled'}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</div>
