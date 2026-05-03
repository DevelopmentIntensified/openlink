<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	let { data } = $props();

	let bounties = $derived(data.bounties || []);
	let stats = $derived(data.stats || {
		total: 0,
		open: 0,
		in_progress: 0,
		submitted: 0,
		completed: 0,
		paid: 0
	});

	// Filters
	let searchQuery = $state('');
	let statusFilter = $state('all');
	let priorityFilter = $state('all');
	let viewMode = $state<'grid' | 'list'>('grid');

	// Get unique skills from all bounties
	let allSkills = $derived.by(() => {
		const skillsSet = new Set<string>();
		bounties.forEach((b: any) => {
			if (b.skills) {
				try {
					const bountySkills = JSON.parse(b.skills);
					bountySkills.forEach((s: string) => skillsSet.add(s));
				} catch {
					// If skills is not JSON, try comma-separated
					b.skills.split(',').forEach((s: string) => {
						const trimmed = s.trim();
						if (trimmed) skillsSet.add(trimmed);
					});
				}
			}
		});
		return Array.from(skillsSet).sort();
	});

	let skillFilter = $state<string[]>([]);

	// Filtered bounties
	let filteredBounties = $derived(() => {
		let result = bounties;

		// Search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			result = result.filter((b: any) =>
				b.title?.toLowerCase().includes(query) ||
				b.description?.toLowerCase().includes(query)
			);
		}

		// Status filter
		if (statusFilter !== 'all') {
			result = result.filter((b: any) => b.status === statusFilter);
		}

		// Priority filter
		if (priorityFilter !== 'all') {
			result = result.filter((b: any) => b.priority === priorityFilter);
		}

		// Skills filter
		if (skillFilter.length > 0) {
			result = result.filter((b: any) => {
				try {
					const bountySkills = JSON.parse(b.skills || '[]');
					return skillFilter.some(s => bountySkills.includes(s));
				} catch {
					return false;
				}
			});
		}

		return result;
	});

	function formatCurrency(amount: number): string {
		return `$${(amount / 100).toFixed(2)}`;
	}

	function getStatusColor(status: string): string {
		const colors: Record<string, string> = {
			open: 'bg-green-100 text-green-800',
			in_progress: 'bg-blue-100 text-blue-800',
			submitted: 'bg-yellow-100 text-yellow-800',
			completed: 'bg-purple-100 text-purple-800',
			paid: 'bg-gray-100 text-gray-800'
		};
		return colors[status] || 'bg-gray-100 text-gray-800';
	}

	function getPriorityColor(priority: string): string {
		const colors: Record<string, string> = {
			low: 'bg-gray-100 text-gray-600',
			medium: 'bg-blue-100 text-blue-600',
			high: 'bg-orange-100 text-orange-600',
			urgent: 'bg-red-100 text-red-600'
		};
		return colors[priority] || 'bg-gray-100 text-gray-600';
	}

	function toggleSkill(skill: string) {
		if (skillFilter.includes(skill)) {
			skillFilter = skillFilter.filter(s => s !== skill);
		} else {
			skillFilter = [...skillFilter, skill];
		}
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
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<h1 class="text-4xl font-bold text-gray-900 mb-4">Bounties</h1>
					<p class="text-xl text-gray-600">Track and manage all bounties</p>
				</div>
			</div>

			<!-- Stats Bar -->
			<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
				<div class="card p-4 animate-scale-in" style="animation-delay: 0.1s;">
					<div class="text-center">
						<p class="text-2xl font-bold text-gray-900">{stats.total}</p>
						<p class="text-xs text-gray-500">Total</p>
					</div>
				</div>

				<div class="card p-4 animate-scale-in" style="animation-delay: 0.2s;">
					<div class="text-center">
						<p class="text-2xl font-bold text-green-600">{stats.open}</p>
						<p class="text-xs text-gray-500">Open</p>
					</div>
				</div>

				<div class="card p-4 animate-scale-in" style="animation-delay: 0.3s;">
					<div class="text-center">
						<p class="text-2xl font-bold text-blue-600">{stats.in_progress}</p>
						<p class="text-xs text-gray-500">In Progress</p>
					</div>
				</div>

				<div class="card p-4 animate-scale-in" style="animation-delay: 0.4s;">
					<div class="text-center">
						<p class="text-2xl font-bold text-yellow-600">{stats.submitted}</p>
						<p class="text-xs text-gray-500">Submitted</p>
					</div>
				</div>

				<div class="card p-4 animate-scale-in" style="animation-delay: 0.5s;">
					<div class="text-center">
						<p class="text-2xl font-bold text-purple-600">{stats.completed}</p>
						<p class="text-xs text-gray-500">Completed</p>
					</div>
				</div>

				<div class="card p-4 animate-scale-in" style="animation-delay: 0.6s;">
					<div class="text-center">
						<p class="text-2xl font-bold text-gray-600">{stats.paid}</p>
						<p class="text-xs text-gray-500">Paid</p>
					</div>
				</div>
			</div>

			<!-- Toolbar -->
			<div class="flex flex-col lg:flex-row gap-4 mb-8">
				<!-- Search -->
				<div class="flex-1 relative">
					<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search bounties..."
						class="input pl-10 w-full"
					/>
				</div>

				<!-- Status Filter -->
				<select bind:value={statusFilter} class="input">
					<option value="all">All Status</option>
					<option value="open">Open</option>
					<option value="in_progress">In Progress</option>
					<option value="submitted">Submitted</option>
					<option value="completed">Completed</option>
					<option value="paid">Paid</option>
				</select>

				<!-- Priority Filter -->
				<select bind:value={priorityFilter} class="input">
					<option value="all">All Priorities</option>
					<option value="low">Low</option>
					<option value="medium">Medium</option>
					<option value="high">High</option>
					<option value="urgent">Urgent</option>
				</select>

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

				<!-- New Bounty Button (for sponsors) -->
				{#if data.isSponsor}
					<a href="/dashboard/bounty/new" class="btn-primary-gradient btn-lift whitespace-nowrap">
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
						</svg>
						New Bounty
					</a>
				{/if}
			</div>

			<!-- Skills Filter -->
			{#if allSkills.length > 0}
				<div class="mb-6">
					<p class="text-sm text-gray-600 mb-2">Filter by skills:</p>
					<div class="flex flex-wrap gap-2">
						{#each allSkills as skill (skill)}
							<button
								onclick={() => toggleSkill(skill)}
								class="px-3 py-1 rounded-full text-sm font-medium transition-all duration-300
									{skillFilter.includes(skill)
										? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
							>
								{skill}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Bounties Display -->
			{#if filteredBounties.length === 0}
				<div class="card p-12 text-center animate-scale-in">
					<div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
						<svg class="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<h2 class="text-2xl font-bold text-gray-900 mb-4">
						{searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || skillFilter.length > 0
							? 'No bounties match your filters'
							: 'No bounties yet'}
					</h2>
					<p class="text-gray-600 mb-8 max-w-md mx-auto">
						{searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || skillFilter.length > 0
							? 'Try adjusting your filters'
							: "There are no bounties to display at the moment."}
					</p>
				</div>
			{:else if viewMode === 'grid'}
				<!-- Grid View -->
				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each filteredBounties as bounty (bounty.id)}
						<a
							href="/bounty/{bounty.id}"
							class="card p-6 hover:shadow-xl transition-all duration-300 animate-scale-in group"
						>
							<div class="flex items-start justify-between mb-4">
								<div class="flex-1">
									<h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
										{bounty.title}
									</h3>
									<div class="flex items-center gap-2 mb-2">
										<span class="px-2 py-1 text-xs rounded-full {getStatusColor(bounty.status)}">
											{bounty.status.replace('_', ' ')}
										</span>
										<span class="px-2 py-1 text-xs rounded-full {getPriorityColor(bounty.priority)}">
											{bounty.priority}
										</span>
									</div>
								</div>
							</div>

							{#if bounty.description}
								<p class="text-sm text-gray-600 mb-4 line-clamp-2">
									{bounty.description}
								</p>
							{/if}

						{#if bounty.skills}
							<div class="flex flex-wrap gap-1 mb-4">
								{#each (() => { try { return JSON.parse(bounty.skills); } catch { return bounty.skills.split(',').map((s: string) => s.trim()); } })().slice(0, 3) as skill (skill)}
									<span class="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs">
										{skill}
									</span>
								{/each}
								{#if (() => { try { return JSON.parse(bounty.skills).length > 3; } catch { return bounty.skills.split(',').length > 3; } })()}
									<span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
										+{(() => { try { return JSON.parse(bounty.skills).length - 3; } catch { return bounty.skills.split(',').length - 3; } })()}
									</span>
								{/if}
							</div>
						{/if}

						<div class="flex items-center justify-between pt-4 border-t border-gray-100">
								<p class="text-2xl font-bold text-amber-600">
									{formatCurrency(bounty.amount)}
								</p>
								{#if bounty.deadline}
									<p class="text-xs text-gray-500">
										Due: {new Date(bounty.deadline).toLocaleDateString()}
									</p>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			{:else}
				<!-- List View -->
				<div class="card overflow-hidden">
					<div class="divide-y divide-gray-100">
						{#each filteredBounties as bounty (bounty.id)}
							<a
								href="/bounty/{bounty.id}"
								class="flex items-center gap-6 p-6 hover:bg-gray-50 transition-colors duration-300 animate-fade-in-up"
							>
								<div class="flex-1 min-w-0">
									<div class="flex items-center gap-3 mb-1">
										<h3 class="font-semibold text-gray-900 truncate">{bounty.title}</h3>
										<span class="px-2 py-1 text-xs rounded-full {getStatusColor(bounty.status)} flex-shrink-0">
											{bounty.status.replace('_', ' ')}
										</span>
										<span class="px-2 py-1 text-xs rounded-full {getPriorityColor(bounty.priority)} flex-shrink-0">
											{bounty.priority}
										</span>
									</div>
									{#if bounty.description}
										<p class="text-sm text-gray-600 truncate">{bounty.description}</p>
									{/if}
								</div>

								<div class="flex items-center gap-6 flex-shrink-0">
									<p class="text-xl font-bold text-amber-600">
										{formatCurrency(bounty.amount)}
									</p>
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
			<p class="text-gray-600 mb-8">Please sign in to view bounties.</p>
			<a href="/login" class="btn-primary-gradient btn-lift w-full justify-center">
				Sign In
				<svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
				</svg>
			</a>
		</div>
	</div>
{/if}

<style>
	:global(.input) {
		@apply px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all duration-300;
	}

	:global(.btn-primary-gradient) {
		@apply px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center;
	}

	:global(.btn-lift) {
		@apply transform hover:-translate-y-0.5 hover:shadow-lg;
	}

	:global(.card) {
		@apply bg-white rounded-2xl shadow-md;
	}

	:global(.animate-fade-in-up) {
		animation: fadeInUp 0.6s ease-out forwards;
	}

	:global(.animate-scale-in) {
		animation: scaleIn 0.5s ease-out forwards;
	}

	:global(.animate-float) {
		animation: float 3s ease-in-out infinite;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes scaleIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes float {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}
</style>
