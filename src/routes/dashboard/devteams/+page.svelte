<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props();
	let teams = $derived(data.teams || []);

	let searchQuery = $state('');
	let showCreateModal = $state(false);
	let newTeamName = $state('');
	let newTeamDesc = $state('');

	let filteredTeams = $derived(
		teams.filter(t =>
			t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
		)
	);

	function formatDate(date: Date | string): string {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

{#if data.user}
	<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
		<div class="max-w-7xl mx-auto">
			<!-- Header -->
			<div class="relative mb-12 animate-fade-in-up">
				<!-- Floating icons -->
				<div class="absolute inset-0 overflow-hidden pointer-events-none">
					<div class="absolute top-10 left-10 animate-float" style="animation-delay: 0s;">
						<svg class="w-8 h-8 text-blue-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
					</div>
					<div class="absolute top-20 right-20 animate-float" style="animation-delay: 1.5s;">
						<svg class="w-6 h-6 text-indigo-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
						</svg>
					</div>
				</div>

				<div class="text-center">
					<div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center animate-float">
						<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
					</div>
					<h1 class="text-4xl font-bold text-gray-900 mb-4">DevTeams</h1>
					<p class="text-xl text-gray-600">Manage your development teams and collaborations</p>
				</div>
			</div>

			<!-- Stats Bar -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
				<div class="card p-6 animate-scale-in" style="animation-delay: 0.1s;">
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
							</svg>
						</div>
						<div>
							<p class="text-3xl font-bold text-gray-900">{teams.length}</p>
							<p class="text-sm text-gray-500">Total Teams</p>
						</div>
					</div>
				</div>

				<div class="card p-6 animate-scale-in" style="animation-delay: 0.2s;">
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
							</svg>
						</div>
						<div>
							<p class="text-3xl font-bold text-gray-900">
								{teams.reduce((sum, t) => sum + t.stats.memberCount, 0)}
							</p>
							<p class="text-sm text-gray-500">Total Members</p>
						</div>
					</div>
				</div>

				<div class="card p-6 animate-scale-in" style="animation-delay: 0.3s;">
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
							</svg>
						</div>
						<div>
							<p class="text-3xl font-bold text-gray-900">
								{teams.filter(t => t.stats.isOwner).length}
							</p>
							<p class="text-sm text-gray-500">Teams Owned</p>
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
						placeholder="Search teams..."
						class="input pl-10 w-full"
					/>
				</div>

				<!-- Create Team Button -->
				<button
					onclick={() => showCreateModal = true}
					class="btn-primary-gradient btn-lift whitespace-nowrap"
				>
					<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
					New Team
				</button>
			</div>

			<!-- Teams Display -->
			{#if filteredTeams.length === 0}
				<div class="card p-12 text-center animate-scale-in">
					<div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
						<svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
					</div>
					<h2 class="text-2xl font-bold text-gray-900 mb-4">
						{searchQuery ? 'No teams match your search' : 'No teams yet'}
					</h2>
					<p class="text-gray-600 mb-8 max-w-md mx-auto">
						{searchQuery
							? 'Try adjusting your search query'
							: 'Create your first development team to collaborate with other developers.'}
					</p>
					{#if !searchQuery}
						<button
							onclick={() => showCreateModal = true}
							class="btn-primary-gradient btn-lift inline-flex"
						>
							<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
							</svg>
							Create Your First Team
						</button>
					{/if}
				</div>
			{:else}
				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each filteredTeams as team, i (team.id)}
						<div
							class="card p-6 hover:shadow-xl transition-all duration-300 animate-scale-in group"
							style="animation-delay: {i * 0.1}s;"
						>
							<div class="flex items-start justify-between mb-4">
								<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
									{team.name.charAt(0).toUpperCase()}
								</div>
								{#if team.stats.isOwner}
									<span class="badge badge-blue">Owner</span>
								{:else}
									<span class="badge badge-gray">Member</span>
								{/if}
							</div>

							<h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
								{team.name}
							</h3>

							{#if team.description}
								<p class="text-sm text-gray-600 mb-4 line-clamp-2">
									{team.description}
								</p>
							{/if}

							<div class="space-y-2 pt-4 border-t border-gray-100">
								<div class="flex items-center justify-between text-sm">
									<span class="text-gray-500">Members</span>
									<span class="font-semibold text-gray-900">{team.stats.memberCount}</span>
								</div>
								<div class="flex items-center justify-between text-sm">
									<span class="text-gray-500">Created</span>
									<span class="font-semibold text-gray-900">{formatDate(team.createdAt)}</span>
								</div>
							</div>

							<div class="mt-4 flex gap-2">
								<a
									href="/dashboard/devteams/{team.id}"
									class="flex-1 btn-secondary text-center text-sm"
								>
									Manage
								</a>
								{#if team.stats.isOwner}
									<button class="btn-danger text-sm px-3 py-1.5">
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
										</svg>
									</button>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Create Team Modal -->
	{#if showCreateModal}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
			role="dialog"
			aria-modal="true"
			aria-label="Create new team"
			tabindex="-1"
			onkeydown={(e) => e.key === 'Escape' && (showCreateModal = false)}
		>
			<button
				class="absolute inset-0 w-full h-full cursor-default"
				onclick={() => showCreateModal = false}
				aria-label="Close modal"
			></button>
			<div
				class="card max-w-md w-full p-6 animate-scale-in relative"
				role="document"
				onclick={(e) => e.stopPropagation()}
			>
		<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
		<div
			class="absolute inset-0"
			role="presentation"
			tabindex="-1"
			onclick={() => showCreateModal = false}
			onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (showCreateModal = false)}
		></div>
			<div
				class="card max-w-md w-full p-6 animate-scale-in relative"
				role="document"
				onclick={(e) => e.stopPropagation()}
			>
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-2xl font-bold text-gray-900">Create New Team</h2>
					<button
						onclick={() => showCreateModal = false}
						class="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<form method="POST" action="?/create" class="space-y-4">
					<div>
						<label for="teamName" class="block text-sm font-semibold text-gray-700 mb-2">
							Team Name *
						</label>
						<input
							type="text"
							id="teamName"
							name="name"
							bind:value={newTeamName}
							required
							class="input"
							placeholder="Awesome Dev Team"
						/>
					</div>

					<div>
						<label for="teamDesc" class="block text-sm font-semibold text-gray-700 mb-2">
							Description
						</label>
						<textarea
							id="teamDesc"
							name="description"
							bind:value={newTeamDesc}
							rows="3"
							class="input resize-none"
							placeholder="What does this team do?"
						></textarea>
					</div>

					<div class="flex gap-3 pt-4">
						<button
							type="button"
							onclick={() => showCreateModal = false}
							class="flex-1 btn-secondary"
						>
							Cancel
						</button>
						<button
							type="submit"
							class="flex-1 btn-primary-gradient btn-lift"
						>
							Create Team
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
{:else}
	<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
		<div class="card p-12 text-center max-w-md animate-scale-in">
			<div class="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
				<svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
				</svg>
			</div>
			<h2 class="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
			<p class="text-gray-600 mb-8">Please sign in to view your teams.</p>
			<a href="/login" class="btn-primary-gradient btn-lift w-full justify-center">
				Sign In
				<svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
				</svg>
			</a>
		</div>
	</div>
{/if}
