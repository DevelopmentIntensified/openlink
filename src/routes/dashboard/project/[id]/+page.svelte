<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props();
	let project = $derived(data.project);
	let isOwner = $derived(data.isOwner);
</script>

{#if project}
	<div class="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-8 px-4">
		<div class="max-w-4xl mx-auto">
			<!-- Header -->
			<div class="mb-8">
				<a href="/dashboard/projects" class="text-amber-600 hover:text-amber-700 inline-flex items-center gap-2 mb-4">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
					Back to Projects
				</a>

				<div class="flex items-start justify-between">
					<div>
						<h1 class="text-4xl font-bold text-gray-900 mb-2">{project.name}</h1>
						{#if project.description}
							<p class="text-lg text-gray-600">{project.description}</p>
						{/if}
					</div>

					{#if isOwner}
						<div class="flex gap-2">
							<a href="/dashboard/project/{project.id}/edit" class="btn-secondary">
								<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
								</svg>
								Edit
							</a>
							<form method="POST" action="?/delete" onsubmit={(e) => !confirm('Are you sure you want to delete this project?') && e.preventDefault()}>
								<button type="submit" class="btn-danger">
									<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
									</svg>
									Delete
								</button>
							</form>
						</div>
					{/if}
				</div>
			</div>

			<!-- Project Info -->
			<div class="grid md:grid-cols-3 gap-6 mb-8">
				<div class="card p-6">
					<h3 class="text-sm font-medium text-gray-500 mb-2">Category</h3>
					<p class="text-lg font-semibold text-gray-900 capitalize">{project.category || 'other'}</p>
				</div>

				<div class="card p-6">
					<h3 class="text-sm font-medium text-gray-500 mb-2">Type</h3>
					<p class="text-lg font-semibold text-gray-900 capitalize">{project.type}</p>
				</div>

				<div class="card p-6">
					<h3 class="text-sm font-medium text-gray-500 mb-2">Bounties</h3>
					<p class="text-lg font-semibold text-gray-900">{project.bounties?.length || 0}</p>
				</div>
			</div>

			<!-- Links -->
			{#if project.repoUrl || project.website}
				<div class="card p-6 mb-8">
					<h2 class="text-xl font-bold text-gray-900 mb-4">Links</h2>
					<div class="space-y-2">
						{#if project.repoUrl}
							<a href={project.repoUrl} target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-amber-600 hover:text-amber-700">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
								</svg>
								Repository
							</a>
						{/if}
						{#if project.website}
							<a href={project.website} target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-amber-600 hover:text-amber-700">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
								</svg>
								Website
							</a>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Bounties -->
			<div class="card p-6">
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-xl font-bold text-gray-900">Bounties</h2>
					{#if isOwner && project.isBountyEnabled}
						<a href="/dashboard/bounties/new?projectId={project.id}" class="btn-primary-gradient btn-lift">
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
							</svg>
							Add Bounty
						</a>
					{/if}
				</div>

				{#if !project.bounties || project.bounties.length === 0}
					<div class="text-center py-8">
						<svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<p class="text-gray-500">No bounties yet</p>
					</div>
				{:else}
					<div class="space-y-4">
						{#each project.bounties as bounty}
							<a href="/bounty/{bounty.id}" class="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
								<div class="flex items-center justify-between">
									<div>
										<h3 class="font-semibold text-gray-900">{bounty.title}</h3>
										<p class="text-sm text-gray-500">{bounty.status}</p>
									</div>
									<p class="text-lg font-bold text-green-600">${(bounty.amount / 100).toFixed(2)}</p>
								</div>
							</a>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
