<script lang="ts">
	let { data } = $props();
	let projects = $derived(data.projects);
	let search = $derived(data.search);
	let category = $derived(data.category);
	
	let searchValue = $state(search || '');
	let selectedCategory = $state(category || '');
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	<!-- Header -->
	<div class="mb-10">
		<h1 class="text-3xl font-bold text-gray-900 mb-2">Explore Projects</h1>
		<p class="text-gray-500">Discover open source projects looking for contributors</p>
	</div>
	
	<!-- Search & Filter -->
	<form method="GET" class="card p-4 mb-8">
		<div class="flex flex-col md:flex-row gap-4">
			<div class="flex-1 relative">
				<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				<input
					type="text"
					name="search"
					bind:value={searchValue}
					placeholder="Search projects by name or description..."
					class="input pl-10"
				/>
			</div>
			
			<select
				name="category"
				bind:value={selectedCategory}
				class="input md:w-48"
			>
				<option value="">All Categories</option>
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
			
			<button type="submit" class="btn-primary">
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				Search
			</button>
		</div>
	</form>
	
	<!-- Results -->
	{#if projects.length === 0}
		<div class="card p-12 text-center">
			<div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
				<svg class="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			</div>
			<h3 class="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
			<p class="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
			<a href="/dashboard/project/new" class="btn-primary">
				Create the First Project
			</a>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each projects as project}
				<a href="/project/{project.id}" class="card p-6 group hover:border-teal-300">
					<div class="flex items-start justify-between mb-4">
						<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg">
							{project.name.charAt(0).toUpperCase()}
						</div>
						<div class="flex gap-2">
							<span class="badge badge-blue capitalize">{project.type}</span>
						</div>
					</div>
					
					<h2 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
						{project.name}
					</h2>
					
					{#if project.description}
						<p class="text-gray-500 text-sm line-clamp-2 mb-4">{project.description}</p>
					{/if}
					
					<div class="flex items-center gap-2 pt-4 border-t border-gray-100">
						<span class="badge bg-gray-100 text-gray-600 capitalize">{project.category || 'other'}</span>
						{#if project.isBountyEnabled}
							<span class="badge badge-green">
								<svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								Bounties
							</span>
						{/if}
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
