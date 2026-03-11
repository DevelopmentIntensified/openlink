<script lang="ts">
	let { data } = $props();
	const { profileUser, projects, bounties, user } = data;
</script>

<svelte:head>
	<title>{profileUser.username} - OpenLink</title>
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
		<div class="flex items-center gap-6 mb-8">
			{#if profileUser.avatarUrl}
				<img src={profileUser.avatarUrl} alt={profileUser.username} class="w-20 h-20 rounded-full" />
			{:else}
				<div class="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center text-2xl font-bold text-white">
					{profileUser.username.charAt(0).toUpperCase()}
				</div>
			{/if}
			<div>
				<h1 class="text-3xl font-bold text-white">{profileUser.username}</h1>
				<p class="text-gray-400">
					Member since {profileUser.createdAt ? new Date(profileUser.createdAt).toLocaleDateString() : 'Unknown'}
				</p>
			</div>
		</div>

		<div class="grid lg:grid-cols-3 gap-8">
			<div class="lg:col-span-2">
				<section class="mb-8">
					<h2 class="text-xl font-semibold text-white mb-4">Projects ({projects.length})</h2>
					{#if projects.length === 0}
						<p class="text-gray-400">No projects yet.</p>
					{:else}
						<div class="grid md:grid-cols-2 gap-4">
							{#each projects as project}
								<a href="/project/{project.id}" class="block p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-blue-600 transition-colors">
									<h3 class="font-medium text-white">{project.name}</h3>
									<p class="text-sm text-gray-400 mt-1 line-clamp-2">{project.description || 'No description'}</p>
									<div class="mt-2 flex items-center gap-2">
										<span class="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300 capitalize">
											{project.type}
										</span>
										{#if project.isBountyEnabled}
											<span class="text-xs text-green-400">Bounties</span>
										{/if}
									</div>
								</a>
							{/each}
						</div>
					{/if}
				</section>

				<section>
					<h2 class="text-xl font-semibold text-white mb-4">Completed Bounties ({bounties.length})</h2>
					{#if bounties.length === 0}
						<p class="text-gray-400">No completed bounties yet.</p>
					{:else}
						<div class="space-y-3">
							{#each bounties as bounty}
								<div class="p-4 bg-gray-900 rounded-lg border border-gray-800">
									<div class="flex items-center justify-between">
										<div>
											<h3 class="font-medium text-white">{bounty.title}</h3>
											<p class="text-sm text-gray-500">{bounty.projectId}</p>
										</div>
										<span class="px-2 py-1 text-xs rounded-full bg-blue-900/30 text-blue-400">
											{bounty.status}
										</span>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</section>
			</div>

			<div class="lg:col-span-1">
				<div class="p-6 bg-gray-900 rounded-xl border border-gray-800">
					<h3 class="text-lg font-semibold text-white mb-4">Stats</h3>
					<div class="space-y-3 text-sm">
						<div class="flex justify-between">
							<span class="text-gray-500">Projects</span>
							<span class="text-white">{projects.length}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-500">Bounties Completed</span>
							<span class="text-white">{bounties.length}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</div>
