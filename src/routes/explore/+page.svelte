<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let projects = $derived(data.projects);
	let search = $derived(data.search);
	let category = $derived(data.category);

	let searchValue = $state('');
	let selectedCategory = $state('');
	let viewMode = $state('grid'); // 'grid' or 'list'

	// Update state when data changes
	$effect(() => {
		searchValue = data.search || '';
		selectedCategory = data.category || '';
	});

	function clearFilters() {
		searchValue = '';
		selectedCategory = '';
	}
</script>

<div class="min-h-screen bg-gray-50 py-12">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header with animated gradient -->
		<div class="relative mb-12 overflow-hidden">
			<div class="absolute inset-0 bg-gradient-to-r from-amber-600/10 via-orange-500/10 to-amber-600/10 rounded-3xl"></div>
			<div class="relative z-10 py-12 px-8 text-center">
				<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-6 animate-fade-in-up">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
					Discover & Filter
				</div>
				<h1 class="text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up delay-100">
					Explore <span class="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Projects</span>
				</h1>
				<p class="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up delay-200">
					Discover open source projects looking for contributors. Filter by category, find bounties that match your skills.
				</p>
			</div>
		</div>

		<!-- Search & Filter Bar -->
		<form method="GET" class="card p-6 mb-8 animate-slide-in-left">
			<div class="flex flex-col md:flex-row gap-4">
				<div class="flex-1 relative group">
					<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
					<input
						type="text"
						name="search"
						bind:value={searchValue}
						placeholder="Search projects by name, description, or tech stack..."
						class="input pl-10 transition-all duration-300 focus:pl-4 focus:border-amber-500"
					/>
				</div>
			
				<div class="relative group">
					<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-2h1a1 1 0 011 2H3zm0 6h-.01M3 20h.01" />
					</svg>
					<select
						name="category"
						bind:value={selectedCategory}
						class="input pl-10 pr-10 appearance-none bg-white cursor-pointer min-w-[200px] transition-all duration-300 focus:pl-4 focus:border-amber-500"
					>
						<option value="">All Categories</option>
						<option value="web">🌐 Web Development</option>
						<option value="mobile">📱 Mobile</option>
						<option value="desktop">🖥️ Desktop</option>
						<option value="backend">⚙️ Backend</option>
						<option value="devops">🔧 DevOps</option>
						<option value="data">📊 Data Science</option>
						<option value="security">🔒 Security</option>
						<option value="other">📦 Other</option>
					</select>
				</div>
			
				<div class="flex gap-2">
					<button type="submit" class="btn-primary-gradient px-6 py-2.5 whitespace-nowrap">
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
						Search
					</button>
				
					{#if searchValue || selectedCategory}
						<button type="button" onclick={clearFilters} class="btn-ghost px-4 py-2.5">
							Clear
						</button>
					{/if}
				
					<!-- View Toggle -->
					<div class="hidden md:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
						<button
							type="button"
							onclick={() => viewMode = 'grid'}
							aria-label="Grid view"
							class="{viewMode === 'grid' ? 'bg-white shadow-sm' : ''} p-2 rounded transition-all duration-200"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zm-10 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-4-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
							</svg>
						</button>
						<button
							type="button"
							onclick={() => viewMode = 'list'}
							aria-label="List view"
							class="{viewMode === 'list' ? 'bg-white shadow-sm' : ''} p-2 rounded transition-all duration-200"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		</form>

		<!-- Results Count -->
		{#if searchValue || selectedCategory}
			<p class="text-sm text-gray-600 mb-6 animate-fade-in">
				Found <span class="font-semibold text-gray-900">{projects.length}</span> project{projects.length !== 1 ? 's' : ''}
				{#if searchValue}
					for "<span class="text-amber-600">{searchValue}</span>"
				{/if}
			</p>
		{/if}

		<!-- Results -->
		{#if projects.length === 0}
			<div class="card p-12 text-center animate-scale-in">
				<div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
					<svg class="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<h3 class="text-2xl font-bold text-gray-900 mb-4">No projects found</h3>
				<p class="text-gray-500 mb-8 max-w-md mx-auto">
					{#if searchValue || selectedCategory}
						Try adjusting your search or filter criteria to discover more projects.
					{:else}
						Be the first to create a project and enable bounties for the community.
					{/if}
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					{#if searchValue || selectedCategory}
						<button onclick={clearFilters} class="btn-secondary">
							Clear Filters
						</button>
					{/if}
					<a href="/dashboard/project/new" class="btn-primary-gradient">
						Create the First Project
						<svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0h-3m3-3v-3m0 0v-3m0 3h-3m3 0h3" />
						</svg>
					</a>
				</div>
			</div>
		{:else}
			<!-- Projects Grid/List -->
			<div class="{viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}">
				{#each projects as project, index}
					<a 
						href="/project/{project.id}" 
						class="card-hover p-6 group block {viewMode === 'list' ? 'flex items-center gap-6' : ''}"
						style="animation-delay: {index * 50}ms"
					>
						<div class="flex items-start {viewMode === 'list' ? 'gap-6 flex-1' : 'gap-4 mb-4'}">
							<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
								{project.name.charAt(0).toUpperCase()}
							</div>
						
							<div class="flex-1 min-w-0">
								<div class="flex items-start justify-between gap-2 mb-2">
									<h2 class="text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition-colors truncate">
										{project.name}
									</h2>
									<div class="flex gap-2 flex-shrink-0">
										<span class="badge badge-blue capitalize">{project.type}</span>
										{#if project.isBountyEnabled}
											<span class="badge badge-green">
												<svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
												</svg>
												Bounties
											</span>
										{/if}
									</div>
								</div>
								
								{#if project.description}
									<p class="text-gray-500 text-sm line-clamp-2 mb-3">{project.description}</p>
								{/if}
								
								<div class="flex items-center gap-3 text-sm">
									<span class="badge bg-gray-100 text-gray-600 capitalize">
										{project.category || 'other'}
									</span>
									<span class="text-gray-400">•</span>
									<span class="text-gray-500">
										{new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
									</span>
								</div>
							</div>
						</div>
						
						{#if viewMode === 'grid'}
							<div class="pt-4 border-t border-gray-100 flex items-center justify-between">
								<span class="text-sm text-gray-500">
									{project.isBountyEnabled ? 'Bounties enabled' : 'No bounties yet'}
								</span>
								<span class="text-amber-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
									View →
								</span>
							</div>
						{/if}
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>