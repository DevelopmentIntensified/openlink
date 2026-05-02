<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let projects = $derived(data.projects || []);

	let viewMode = $state<'grid' | 'list'>('grid');
	let searchQuery = $state('');

	let filteredProjects = $derived(
		projects.filter(p =>
			p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
		)
	);

	function formatCurrency(amount: number): string {
		return `$${(amount / 100).toFixed(2)}`;
	}

	function getCategoryColor(category: string): string {
		const colors: Record<string, string> = {
			web: 'bg-blue-100 text-blue-800',
			mobile: 'bg-green-100 text-green-800',
			desktop: 'bg-purple-100 text-purple-800',
			backend: 'bg-orange-100 text-orange-800',
			devops: 'bg-red-100 text-red-800',
			data: 'bg-indigo-100 text-indigo-800',
			security: 'bg-yellow-100 text-yellow-800',
			other: 'bg-gray-100 text-gray-800'
		};
		return colors[category] || colors.other;
	}
</script>

{#if data.user}
	<div class="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-8 px-4">
		<div class="max-w-7xl mx-auto">
			<!-- Header with floating icons -->
			<div class="relative mb-12 animate-fade-in-up">
				<!-- Floating bounty icons -->
				<div class="absolute inset-0 overflow-hidden pointer-events-none">
					<div class="absolute top-10 left-10 animate-float" style="animation-delay: 0s;">
						<svg class="w-8 h-8 text-amber-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
						</svg>
					</div>
					<div class="absolute top-20 right-20 animate-float" style="animation-delay: 1s;">
						<svg class="w-6 h-6 text-orange-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
				</div>

				<div class="text-center">
					<div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center animate-float">
						<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
						</svg>
					</div>
					<h1 class="text-4xl font-bold text-gray-900 mb-4">Your Projects</h1>
					<p class="text-xl text-gray-600">Manage and track all your projects in one place</p>
				</div>
			</div>

			<!-- Stats Bar -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
				<div class="card p-6 animate-scale-in" style="animation-delay: 0.1s;">
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
							</svg>
						</div>
						<div>
							<p class="text-3xl font-bold text-gray-900">{projects.length}</p>
							<p class="text-sm text-gray-500">Total Projects</p>
						</div>
					</div>
				</div>

				<div class="card p-6 animate-scale-in" style="animation-delay: 0.2s;">
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div>
							<p class="text-3xl font-bold text-gray-900">
								{projects.reduce((sum, p) => sum + p.stats.totalBounties, 0)}
							</p>
							<p class="text-sm text-gray-500">Total Bounties</p>
						</div>
					</div>
				</div>

				<div class="card p-6 animate-scale-in" style="animation-delay: 0.3s;">
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
							</svg>
						</div>
						<div>
							<p class="text-3xl font-bold text-gray-900">
								{formatCurrency(projects.reduce((sum, p) => sum + p.stats.totalValue, 0))}
							</p>
							<p class="text-sm text-gray-500">Total Value</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Toolbar -->
			<div class="flex flex-col sm:flex-row gap-4 mb-8">
				<!-- Search -->
				<div class="flex-1 relative">
					<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search projects..."
						class="input pl-10 w-full"
					/>
				</div>

				<!-- View Toggle -->
				<div class="flex gap-2">
				<button
					onclick={() => viewMode = 'grid'}
					aria-label="Grid view"
					class="p-2 rounded-lg transition-all duration-300 {viewMode === 'grid' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
					</svg>
				</button>
				<button
					onclick={() => viewMode = 'list'}
					aria-label="List view"
					class="p-2 rounded-lg transition-all duration-300 {viewMode === 'list' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
					</svg>
				</button>
				</div>

				<!-- New Project Button -->
				<a href="/dashboard/project/new" class="btn-primary-gradient btn-lift whitespace-nowrap">
					<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
					New Project
				</a>
			</div>

			<!-- Projects Display -->
			{#if filteredProjects.length === 0}
				<div class="card p-12 text-center animate-scale-in">
					<div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
						<svg class="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
						</svg>
					</div>
					<h2 class="text-2xl font-bold text-gray-900 mb-4">
						{searchQuery ? 'No projects match your search' : 'No projects yet'}
					</h2>
					<p class="text-gray-600 mb-8 max-w-md mx-auto">
						{searchQuery
							? 'Try adjusting your search query'
							: 'Create your first project and start receiving bounty funding from sponsors.'}
					</p>
					{#if !searchQuery}
						<a href="/dashboard/project/new" class="btn-primary-gradient btn-lift inline-flex">
							<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
							</svg>
							Create Your First Project
						</a>
					{/if}
				</div>
			{:else if viewMode === 'grid'}
				<!-- Grid View -->
				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each filteredProjects as project, i (project.id)}
						<a
							href="/project/{project.id}"
							class="card p-6 hover:shadow-xl transition-all duration-300 animate-scale-in group"
							style="animation-delay: {i * 0.1}s;"
						>
							<div class="flex items-start justify-between mb-4">
								<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
									{project.name.charAt(0).toUpperCase()}
								</div>
								<span class="badge {getCategoryColor(project.category)} capitalize">
									{project.category || 'other'}
								</span>
							</div>

							<h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
								{project.name}
							</h3>

							{#if project.description}
								<p class="text-sm text-gray-600 mb-4 line-clamp-2">
									{project.description}
								</p>
							{/if}

							<div class="space-y-2 pt-4 border-t border-gray-100">
								<div class="flex items-center justify-between text-sm">
									<span class="text-gray-500">Bounties</span>
									<span class="font-semibold text-gray-900">{project.stats.totalBounties}</span>
								</div>
								<div class="flex items-center justify-between text-sm">
									<span class="text-gray-500">Active</span>
									<span class="font-semibold text-amber-600">{project.stats.activeBounties}</span>
								</div>
								<div class="flex items-center justify-between text-sm">
									<span class="text-gray-500">Value</span>
									<span class="font-semibold text-green-600">{formatCurrency(project.stats.totalValue)}</span>
								</div>
							</div>

							{#if project.isBountyEnabled}
								<div class="mt-4 flex items-center gap-2 text-xs text-amber-600">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									Bounties Enabled
								</div>
							{/if}
						</a>
					{/each}
				</div>
			{:else}
				<!-- List View -->
				<div class="card overflow-hidden">
					<div class="divide-y divide-gray-100">
						{#each filteredProjects as project, i (project.id)}
							<a
								href="/project/{project.id}"
								class="flex items-center gap-6 p-6 hover:bg-gray-50 transition-colors duration-300 animate-fade-in-up"
								style="animation-delay: {i * 0.05}s;"
							>
								<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
									{project.name.charAt(0).toUpperCase()}
								</div>

								<div class="flex-1 min-w-0">
									<div class="flex items-center gap-3 mb-1">
										<h3 class="font-semibold text-gray-900 truncate">{project.name}</h3>
										<span class="badge {getCategoryColor(project.category)} capitalize flex-shrink-0">
											{project.category || 'other'}
										</span>
									</div>
									{#if project.description}
										<p class="text-sm text-gray-600 truncate">{project.description}</p>
									{/if}
								</div>

								<div class="flex items-center gap-6 flex-shrink-0">
									<div class="text-center">
										<p class="text-sm font-semibold text-gray-900">{project.stats.totalBounties}</p>
										<p class="text-xs text-gray-500">Bounties</p>
									</div>
									<div class="text-center">
										<p class="text-sm font-semibold text-amber-600">{project.stats.activeBounties}</p>
										<p class="text-xs text-gray-500">Active</p>
									</div>
									<div class="text-center">
										<p class="text-sm font-semibold text-green-600">{formatCurrency(project.stats.totalValue)}</p>
										<p class="text-xs text-gray-500">Value</p>
									</div>
									<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
									</svg>
								</div>
							</a>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
{:else}
	<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50">
		<div class="card p-12 text-center max-w-md animate-scale-in">
			<div class="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
				<svg class="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
				</svg>
			</div>
			<h2 class="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
			<p class="text-gray-600 mb-8">Please sign in to view your projects.</p>
			<a href="/login" class="btn-primary-gradient btn-lift w-full justify-center">
				Sign In
				<svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
				</svg>
			</a>
		</div>
	</div>
{/if}
