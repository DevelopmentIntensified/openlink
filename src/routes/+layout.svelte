<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	
	let { children, data } = $props();
	let user = $derived(data?.user);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="apple-touch-icon" href={favicon} />
	<meta name="theme-color" content="#ea580c" />
	
	<meta name="description" content="BountyForge - Connect with open source developers and fund bounties for OSS projects" />
	
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="BountyForge" />
	<meta property="og:title" content="BountyForge - OSS Bounty Platform" />
	<meta property="og:description" content="Connect with open source developers and fund bounties for OSS projects" />
	<meta property="og:image" content="/og-image.svg" />
	
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="BountyForge - OSS Bounty Platform" />
	<meta name="twitter:description" content="Connect with open source developers and fund bounties for OSS projects" />
	<meta name="twitter:image" content="/og-image.svg" />
	
	<title>BountyForge - OSS Bounty Platform</title>
</svelte:head>

<nav class="sticky top-0 z-50 glass border-b border-gray-200/50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16">
			<div class="flex items-center gap-10">
				<a href="/" class="flex items-center gap-2">
					<div class="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
						<svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
							<rect x="10" y="3" width="4" height="14" rx="1" fill="currentColor"/>
							<rect x="7" y="3" width="10" height="4" rx="1" fill="currentColor"/>
						</svg>
					</div>
					<span class="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">BountyForge</span>
				</a>
				<div class="hidden sm:flex items-center gap-1">
					<a href="/explore" class="nav-link px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200">
						Explore
					</a>
					<a href="/about" class="nav-link px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200">
						About
					</a>
					{#if user}
						<a href="/dashboard" class="nav-link px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200">
							Dashboard
						</a>
					{/if}
				</div>
			</div>
			<div class="flex items-center gap-3">
				{#if user}
					<a href="/profile/{user.username}" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200">
						{#if user.image}
							<img src={user.image} alt={user.name} class="h-8 w-8 rounded-full ring-2 ring-gray-200" />
						{:else}
							<div class="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm font-semibold">
								{user.name?.charAt(0)?.toUpperCase() ?? 'U'}
							</div>
						{/if}
						<span class="text-sm font-medium text-gray-700">{user.name}</span>
					</a>
		{:else}
				<a href="/dev/signup" class="btn-ghost text-sm">Dev</a>
				<a href="/sponsor/signup" class="btn-primary-gradient text-sm btn-lift">Sponsor</a>
			{/if}
			</div>
		</div>
	</div>
</nav>

<main class="min-h-screen">
	{@render children()}
</main>

<footer class="border-t border-gray-200 bg-white py-8">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex flex-col sm:flex-row justify-between items-center gap-4">
			<div class="flex items-center gap-2">
				<div class="w-6 h-6 rounded bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
					<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
						<rect x="10" y="3" width="4" height="14" rx="1" fill="currentColor"/>
						<rect x="7" y="3" width="10" height="4" rx="1" fill="currentColor"/>
					</svg>
				</div>
				<span class="text-sm text-gray-500">BountyForge</span>
			</div>
			<div class="flex items-center gap-6 text-sm text-gray-500">
				<a href="/pricing" class="hover:text-gray-900 transition">Pricing</a>
				<a href="/legal/terms" class="hover:text-gray-900 transition">Terms</a>
				<a href="/legal/privacy" class="hover:text-gray-900 transition">Privacy</a>
			</div>
		</div>
	</div>
</footer>
