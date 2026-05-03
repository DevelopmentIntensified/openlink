<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props();
	let userProjects = $derived(data.userProjects || []);
	let userBounties = $derived(data.userBounties || []);
</script>

{#if data.user}
	<div class="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-8 px-4">
		<div class="max-w-7xl mx-auto">
			<!-- Stats Bar -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
				<div class="card p-6 animate-scale-in" style="animation-delay: 0.1s;">
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
							</svg>
						</div>
						<div>
							<p class="text-3xl font-bold text-gray-900">{userProjects.length}</p>
							<p class="text-sm text-gray-500">Projects</p>
						</div>
					</div>
				</div>

				<div class="card p-6 animate-scale-in" style="animation-delay: 0.2s;">
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
							</svg>
						</div>
						<div>
							<p class="text-3xl font-bold text-gray-900">{userBounties.length}</p>
							<p class="text-sm text-gray-500">Bounties</p>
						</div>
					</div>
				</div>

				<div class="card p-6 animate-scale-in" style="animation-delay: 0.3s;">
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
							</svg>
						</div>
						<div>
							<p class="text-3xl font-bold text-gray-900">$0</p>
							<p class="text-sm text-gray-500">Total Earned</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Quick Actions -->
			<div class="flex flex-wrap gap-3 mb-8">
				<a href="/dashboard/project/new" class="btn-primary-gradient btn-lift">
					<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
					</svg>
					New Project
				</a>
				{#if userProjects.length > 0}
					<a href="/explore" class="btn-secondary">
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
						</svg>
						Explore Projects
					</a>
				{/if}
			</div>

			<!-- Projects & Bounties -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<!-- Your Projects -->
				<div class="card p-6">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-lg font-semibold text-gray-900">Your Projects</h2>
						<span class="badge badge-amber">{userProjects.length}</span>
					</div>

					{#if userProjects.length === 0}
						<div class="text-center py-8">
							<div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center">
								<svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
								</svg>
							</div>
							<p class="text-gray-500 mb-4">No projects yet</p>
							<a href="/dashboard/project/new" class="btn-primary">
								Create Your First Project
							</a>
						</div>
					{:else}
						<div class="space-y-3">
							{#each userProjects as project}
								<a href="/project/{project.id}" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition">
									<div class="flex items-center gap-3">
										<div class="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-semibold">
											{project.name.charAt(0).toUpperCase()}
										</div>
										<div>
											<p class="font-medium text-gray-900">{project.name}</p>
											<p class="text-sm text-gray-500 capitalize">{project.type}</p>
										</div>
									</div>
									<span class="badge badge-blue capitalize">{project.category || 'other'}</span>
								</a>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Your Bounties -->
				<div class="card p-6">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-lg font-semibold text-gray-900">Your Bounties</h2>
						<span class="badge badge-green">{userBounties.length}</span>
					</div>

					{#if userBounties.length === 0}
						<div class="text-center py-8">
							<div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center">
								<svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
								</svg>
							</div>
							<p class="text-gray-500 mb-4">No bounties yet</p>
							{#if userProjects.length > 0}
								<a href="/dashboard/bounty/new/{userProjects[0].id}" class="btn-primary">
									Create Your First Bounty
								</a>
							{/if}
						</div>
					{:else}
						<div class="space-y-3">
							{#each userBounties as bounty}
								<a href="/project/{bounty.projectId}/bounty/{bounty.id}" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition">
									<div>
										<p class="font-medium text-gray-900">{bounty.title}</p>
										<p class="text-sm text-gray-500 capitalize">{bounty.status}</p>
									</div>
									<span class="font-semibold text-amber-600">${(bounty.amount / 100).toFixed(2)}</span>
								</a>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50">
		<div class="card p-12 text-center max-w-md animate-scale-in">
			<div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
				<svg class="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
				</svg>
			</div>
			<h2 class="text-2xl font-bold text-gray-900 mb-4">Welcome to BountyForge</h2>
			<p class="text-gray-600 mb-6 max-w-md mx-auto">Sign in to access your dashboard, manage your projects, and track your bounties.</p>
			<div class="flex justify-center gap-3">
				<a href="/login" class="btn-primary btn-lift">
					Sign In
				</a>
				<a href="/auth/signup" class="btn-primary-gradient btn-lift">
					Sign Up
				</a>
			</div>
		</div>
	</div>
{/if}
