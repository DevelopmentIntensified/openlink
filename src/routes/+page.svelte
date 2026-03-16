<script lang="ts">
	let { data } = $props();
	let featuredProjects = $derived(data.featuredProjects);
</script>

<div class="relative overflow-hidden">
	<!-- Hero Section -->
	<div class="relative px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
		<div class="absolute inset-0 -z-10">
			<div class="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-orange-50"></div>
			<div class="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30 animate-float" style="animation-delay: 0s;"></div>
			<div class="absolute bottom-0 left-0 translate-y-12 -translate-x-1/4 w-96 h-96 bg-amber-200 rounded-full blur-3xl opacity-30 animate-float" style="animation-delay: 1.5s;"></div>
		</div>
		
		<div class="max-w-4xl mx-auto text-center">
			<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-8 animate-fade-in-up">
				<span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
				Open Source Funding Reimagined
			</div>
			
			<h1 class="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-6 animate-fade-in-up delay-100">
				Ship faster with
				<span class="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> Bounties</span>
			</h1>
			
			<p class="text-xl text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed animate-fade-in-up delay-200">
				Fund features. Pay contributors. Get results.
			</p>
			
			<div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
				<a href="/dashboard/project/new" class="btn-primary-gradient text-base px-8 py-3 btn-lift">
					Start Your Project
					<svg class="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
					</svg>
				</a>
				<a href="/explore" class="btn-secondary text-base px-8 py-3 btn-lift">
					Explore Projects
				</a>
			</div>
		</div>
	</div>
	
	<!-- Stats -->
	<div class="border-y border-gray-200/50 bg-white/50 backdrop-blur-sm">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="grid grid-cols-3 gap-8 text-center">
				<div>
					<div class="text-3xl font-bold text-gray-900">$0</div>
					<div class="text-sm text-gray-500 mt-1">Total Funded</div>
				</div>
				<div>
					<div class="text-3xl font-bold text-gray-900">0</div>
					<div class="text-sm text-gray-500 mt-1">Active Bounties</div>
				</div>
				<div>
					<div class="text-3xl font-bold text-gray-900">0</div>
					<div class="text-sm text-gray-500 mt-1">Contributors</div>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Featured Projects -->
	<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
		<div class="flex items-center justify-between mb-10">
			<div>
				<h2 class="text-2xl font-bold text-gray-900">Featured Projects</h2>
				<p class="text-gray-500 mt-1">Open source projects with active bounties</p>
			</div>
			<a href="/explore" class="link text-sm font-medium">View all →</a>
		</div>
		
		{#if featuredProjects.length === 0}
			<div class="card p-12 text-center">
				<div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
					<svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
				<p class="text-gray-500 mb-6">Be the first to create a project and enable bounties</p>
				<a href="/dashboard/project/new" class="btn-primary">
					Create Your Project
				</a>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each featuredProjects as project}
					<a href="/project/{project.id}" class="card-hover p-6 group">
						<div class="flex items-start justify-between mb-4">
							<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
								{project.name.charAt(0).toUpperCase()}
							</div>
							<span class="badge badge-blue capitalize">{project.type}</span>
						</div>
						<h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
							{project.name}
						</h3>
						{#if project.description}
							<p class="text-gray-500 text-sm line-clamp-2 mb-4">{project.description}</p>
						{/if}
						<div class="flex items-center justify-between pt-4 border-t border-gray-100">
							<span class="text-sm text-gray-500">Bounties enabled</span>
							<span class="text-amber-600 font-medium text-sm group-hover:translate-x-1 transition-transform">View →</span>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</section>
	
	<!-- How It Works -->
	<section class="bg-gray-50 py-20">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-16">
				<h2 class="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
				<p class="text-gray-500 max-w-2xl mx-auto">Three simple steps to fund and build the features your project needs</p>
			</div>
			
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div class="relative">
					<div class="card p-8 text-center">
						<div class="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
							<span class="text-2xl font-bold text-white">1</span>
						</div>
						<h3 class="text-xl font-semibold text-gray-900 mb-3">Create a Project</h3>
						<p class="text-gray-500">Sign up and create your open source project. Enable bounties to start receiving funding.</p>
					</div>
					<div class="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
						<svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
						</svg>
					</div>
				</div>
				
				<div class="relative">
					<div class="card p-8 text-center">
						<div class="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
							<span class="text-2xl font-bold text-white">2</span>
						</div>
						<h3 class="text-xl font-semibold text-gray-900 mb-3">Post Bounties</h3>
						<p class="text-gray-500">Create bounties for features, bug fixes, or improvements. Set your own price.</p>
					</div>
					<div class="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
						<svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
						</svg>
					</div>
				</div>
				
				<div class="card p-8 text-center">
					<div class="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
						<span class="text-2xl font-bold text-white">3</span>
					</div>
					<h3 class="text-xl font-semibold text-gray-900 mb-3">Get Work Done</h3>
					<p class="text-gray-500">Developers claim bounties, submit their work, and get paid upon completion.</p>
				</div>
			</div>
		</div>
	</section>
	
	<!-- CTA -->
	<section class="py-20">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="card p-12 text-center relative overflow-hidden">
				<div class="absolute inset-0 bg-gradient-to-br from-amber-600 to-orange-600"></div>
				<div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2MmgtMnYtMnptLTQgNHYyaC0ydi0yaDJ6bTgtOGgydjJoLTJ2LTJ6bS04IDhoMnYyaC0ydi0yek0zMiAyNnYyaC0ydi0yaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
				<div class="relative">
					<h2 class="text-3xl font-bold text-white mb-4">Ready to fund your project?</h2>
					<p class="text-amber-100 mb-8 max-w-xl mx-auto">				Join open source maintainers who are already using BountyForge to build the features their users need.</p>
					<a href="/dashboard/project/new" class="btn-primary-gradient btn-lift">
						Get Started Free
						<svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
					</a>
				</div>
			</div>
		</div>
	</section>
</div>
