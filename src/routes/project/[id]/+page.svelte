<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();
	let project = $derived(data.project);

	let sortedBounties = $derived(
		[...project.bounties].sort((a, b) => {
			const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
			return (priorityOrder[a.priority as keyof typeof priorityOrder] ?? 4) - (priorityOrder[b.priority as keyof typeof priorityOrder] ?? 4);
		})
	);
</script>

<div class="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-12 px-4">
	<div class="max-w-5xl mx-auto">
		<!-- Project Header -->
		<div class="card-hover p-8 mb-8 animate-fade-in-up">
			<div class="flex flex-col md:flex-row justify-between items-start gap-6">
				<div class="flex-1">
					<div class="flex items-center gap-3 mb-4">
						<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
							</svg>
						</div>
						<div>
							<h1 class="text-3xl font-bold text-gray-900">{project.name}</h1>
							<div class="flex items-center gap-2 mt-2">
								<span class="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">{project.category}</span>
								<span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{project.type}</span>
								{#if project.isBountyEnabled}
									<span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1">
										<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
											<path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
											<path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
										</svg>
										Bounties Enabled
									</span>
								{/if}
							</div>
						</div>
					</div>

					{#if project.description}
						<p class="text-gray-600 leading-relaxed mb-6">{project.description}</p>
					{/if}

					<div class="flex flex-wrap gap-4">
						{#if project.repoUrl}
							<a href={project.repoUrl} target="_blank" rel="noopener noreferrer" class="btn-secondary inline-flex items-center gap-2">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"/>
								</svg>
								Repository
							</a>
						{/if}
						{#if project.website}
							<a href={project.website} target="_blank" rel="noopener noreferrer" class="btn-secondary inline-flex items-center gap-2">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
								</svg>
								Website
							</a>
						{/if}
					</div>
				</div>

				{#if project.owner}
					<a href="/profile/{project.owner.username}" class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-amber-50 transition-all duration-200 group">
						{#if project.owner.image}
							<img src={project.owner.image} alt={project.owner.username} class="w-12 h-12 rounded-full ring-2 ring-amber-200 group-hover:ring-amber-400 transition-all" />
						{:else}
							<div class="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-lg font-semibold">
								{project.owner.name?.charAt(0)?.toUpperCase() ?? 'U'}
							</div>
						{/if}
						<div>
							<p class="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">{project.owner.name}</p>
							<p class="text-sm text-gray-500">@{project.owner.username}</p>
						</div>
					</a>
				{/if}
			</div>
		</div>

		<!-- Bounties Section -->
		<div class="animate-fade-in-up" style="animation-delay: 0.1s">
			<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
				<div>
					<h2 class="text-2xl font-bold text-gray-900">Bounties</h2>
					<p class="text-gray-600 mt-1">{project.bounties.length} {project.bounties.length === 1 ? 'bounty' : 'bounties'} available</p>
				</div>

				{#if project.isBountyEnabled}
					<a href="/dashboard/bounty/new?projectId={project.id}" class="btn-amber inline-flex items-center gap-2">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
						</svg>
						Create Bounty
					</a>
				{/if}
			</div>

			{#if sortedBounties.length === 0}
				<div class="card p-12 text-center">
					<div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
						<svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
					</div>
					<h3 class="text-xl font-semibold text-gray-900 mb-2">No bounties yet</h3>
					<p class="text-gray-600 mb-6">Be the first to create a bounty for this project!</p>
					{#if project.isBountyEnabled}
						<a href="/dashboard/bounty/new?projectId={project.id}" class="btn-amber inline-flex items-center gap-2">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
							</svg>
							Create First Bounty
						</a>
					{/if}
				</div>
			{:else}
				<div class="grid gap-4">
					{#each sortedBounties as bounty, index (bounty.id)}
						<a href="/project/{project.id}/bounty/{bounty.id}" class="card-hover p-6 group animate-fade-in-up" style="animation-delay: {index * 0.05}s">
							<div class="flex flex-col sm:flex-row justify-between items-start gap-4">
								<div class="flex-1">
									<div class="flex items-start gap-3 mb-3">
										<div class="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
											<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
											</svg>
										</div>
										<div class="flex-1">
											<h3 class="text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">{bounty.title}</h3>
											{#if bounty.description}
												<p class="text-gray-600 text-sm mt-1 line-clamp-2">{bounty.description}</p>
											{/if}
										</div>
									</div>

									<div class="flex flex-wrap items-center gap-2">
										<span class="px-3 py-1 rounded-full text-xs font-medium
											{bounty.status === 'open' ? 'bg-green-100 text-green-800' : ''}
											{bounty.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : ''}
											{bounty.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' : ''}
											{bounty.status === 'completed' ? 'bg-purple-100 text-purple-800' : ''}
											{bounty.status === 'paid' ? 'bg-gray-100 text-gray-800' : ''}
										">
											{bounty.status.replace('_', ' ')}
										</span>
										<span class="px-3 py-1 rounded-full text-xs font-medium
											{bounty.priority === 'low' ? 'bg-gray-100 text-gray-800' : ''}
											{bounty.priority === 'medium' ? 'bg-blue-100 text-blue-800' : ''}
											{bounty.priority === 'high' ? 'bg-orange-100 text-orange-800' : ''}
											{bounty.priority === 'urgent' ? 'bg-red-100 text-red-800' : ''}
										">
											{bounty.priority}
										</span>
										{#if bounty.tags}
											{#each bounty.tags.split(',').slice(0, 3) as tag, i}
												<span class="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">{tag.trim()}</span>
											{/each}
										{/if}
									</div>
								</div>

								<div class="text-right">
									<p class="text-2xl font-bold text-gray-900">${bounty.amount}</p>
									<p class="text-sm text-gray-500">
										{bounty.claimCount ?? 0} {bounty.claimCount === 1 ? 'claim' : 'claims'}
									</p>
								</div>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
