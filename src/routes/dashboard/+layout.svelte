<script lang="ts">
	import '../../app.css';
	let { children, data } = $props();
	let user = $derived(data?.session?.user);
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Dashboard Header -->
	<header class="bg-white border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-16">
				<div class="flex items-center gap-6">
					<a href="/" class="flex items-center gap-2">
						<div class="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
							<svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
								<rect x="10" y="3" width="4" height="14" rx="1" fill="currentColor"/>
								<rect x="7" y="3" width="10" height="4" rx="1" fill="currentColor"/>
							</svg>
						</div>
						<span class="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">BountyForge</span>
					</a>
					<nav class="hidden sm:flex items-center gap-1">
						<a href="/dashboard" class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
							Dashboard
						</a>
						<a href="/dashboard/projects" class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
							Projects
						</a>
						<a href="/dashboard/devteams" class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
							Teams
						</a>
						<a href="/explore" class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
							Explore
						</a>
					</nav>
				</div>
				<div class="flex items-center gap-3">
					<a href="/dashboard/project/new" class="btn-primary text-sm">
						<svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
						</svg>
						New Project
					</a>
					{#if user}
						<a href="/profile/{user.username}" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
							{#if user.image}
								<img src={user.image} alt={user.name} class="h-8 w-8 rounded-full" />
							{:else}
								<div class="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm font-semibold">
									{user.name?.charAt(0)?.toUpperCase() ?? 'U'}
								</div>
							{/if}
							<span class="text-sm font-medium text-gray-700">{user.name}</span>
						</a>
					{/if}
				</div>
			</div>
		</div>
	</header>

	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{@render children()}
	</main>
</div>
