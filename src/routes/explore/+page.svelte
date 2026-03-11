<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Explore Projects - OpenLink</title>
</svelte:head>

<div class="min-h-screen bg-gray-950">
	<header class="border-b border-gray-800">
		<nav class="container mx-auto px-4 py-4 flex items-center justify-between">
			<a href="/" class="text-xl font-bold text-white">OpenLink</a>
			<div class="flex items-center gap-4">
				<a href="/explore" class="text-gray-300 hover:text-white transition-colors">Explore</a>
				{#if data.user}
					<a href="/dashboard" class="text-gray-300 hover:text-white transition-colors">Dashboard</a>
				{:else}
					<a href="/login" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">Sign In</a>
				{/if}
			</div>
		</nav>
	</header>

	<main class="container mx-auto px-4 py-8">
		<h1 class="text-3xl font-bold text-white mb-8">Explore Projects</h1>

		<form method="GET" class="mb-8 flex gap-4">
			<input
				type="text"
				name="q"
				value={data.search}
				placeholder="Search projects..."
				class="flex-1 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600"
			/>
			<select
				name="type"
				class="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-600"
			>
				<option value="">All Types</option>
				<option value="individual" selected={data.type === 'individual'}>Individual</option>
				<option value="team" selected={data.type === 'team'}>Team</option>
				<option value="community" selected={data.type === 'community'}>Community</option>
			</select>
			<button type="submit" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
				Search
			</button>
		</form>

		{#if data.projects.length === 0}
			<div class="text-center py-12">
				<p class="text-gray-400 text-lg">No projects found. Be the first to add one!</p>
				<a href="/login" class="inline-block mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
					Add Project
				</a>
			</div>
		{:else}
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each data.projects as project}
					<a href="/project/{project.id}" class="block p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-blue-600 transition-colors">
						<div class="flex items-start justify-between mb-2">
							<h3 class="text-lg font-semibold text-white">{project.name}</h3>
							<span class="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-300 capitalize">
								{project.type}
							</span>
						</div>
						<p class="text-gray-400 text-sm mb-4 line-clamp-2">
							{project.description || 'No description'}
						</p>
						<div class="flex items-center justify-between text-sm">
							<span class="text-gray-500">by {project.ownerUsername}</span>
							{#if project.isBountyEnabled}
								<span class="text-green-400">Bounties enabled</span>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</main>
</div>
