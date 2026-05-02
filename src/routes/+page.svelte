<script lang="ts">
	let { data } = $props();
	let featuredProjects = $derived(data.featuredProjects);
</script>

<div class="relative overflow-hidden">
	<!-- Hero Section with Blue + Orange Gradient -->
	<div class="relative px-4 sm:px-6 lg:px-8 py-24 sm:py-32 overflow-hidden">
		<div class="absolute inset-0 -z-10">
			<div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50"></div>
			<div class="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30 animate-float" style="animation-delay: 0s;"></div>
			<div class="absolute bottom-0 left-0 translate-y-12 -translate-x-1/4 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30 animate-float" style="animation-delay: 1.5s;"></div>
		</div>

		<div class="max-w-4xl mx-auto text-center relative z-10">
			<!-- Floating badges -->
			<div class="flex items-center justify-center gap-4 mb-8 animate-fade-in-up">
				<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-sm font-medium">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					For Sponsors
				</div>
				<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-sm font-medium">
					<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
						<path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
					For Developers
				</div>
			</div>

			<h1 class="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-6 animate-fade-in-up">
				Where <span class="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Sponsors</span> Meet <span class="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Devs</span>
			</h1>

			<p class="text-xl text-gray-600 mb-4 max-w-xl mx-auto leading-relaxed animate-fade-in-up delay-100">
				Fund the features you need. Build the code you want.
			</p>

			<p class="text-lg text-gray-500 mb-10 max-w-xl mx-auto animate-fade-in-up delay-200">
				The open source bounty platform. Simple, transparent, and built for growth.
			</p>

			<div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
				<a href="/dev/signup" class="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-base px-8 py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl btn-lift">
					Join as Developer
				</a>
				<a href="/sponsor/signup" class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-base px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl btn-lift">
					Join as Sponsor
				</a>
			</div>
		</div>
	</div>

	<!-- Live Stats with Blue + Orange -->
	<div class="border-y border-gray-200/50 bg-gradient-to-r from-blue-50/50 via-white to-orange-50/50 backdrop-blur-sm">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="grid grid-cols-3 gap-8 text-center">
				<div class="group cursor-default">
					<div class="text-3xl font-bold text-blue-600 transition-all duration-300 group-hover:scale-110">
						$0
					</div>
					<div class="text-sm text-gray-500 mt-1">Total Funded</div>
				</div>
				<div class="group cursor-default">
					<div class="text-3xl font-bold text-amber-600 transition-all duration-300 group-hover:scale-110">
						0
					</div>
					<div class="text-sm text-gray-500 mt-1">Active Bounties</div>
				</div>
				<div class="group cursor-default">
					<div class="text-3xl font-bold text-indigo-600 transition-all duration-300 group-hover:scale-110">
						0%
					</div>
					<div class="text-sm text-gray-500 mt-1">Platform Fee for Devs</div>
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
				<div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center">
					<svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2h6a2 2 0 012 2" />
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
				<p class="text-gray-500 mb-6">Be the first to create a project and enable bounties</p>
				<a href="/dashboard/project/new" class="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-200">
					Create Your Project
				</a>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each featuredProjects as project}
					<a href="/project/{project.id}" class="card-hover p-6 group border-2 border-transparent hover:border-amber-200 transition-colors duration-300">
						<div class="flex items-start justify-between mb-4">
							<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
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

	<!-- How It Works - Blue to Orange Flow -->
	<section class="py-20 bg-gradient-to-br from-blue-50/50 to-orange-50/50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-16">
				<h2 class="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
				<p class="text-gray-500 max-w-2xl mx-auto">Three simple steps — sponsors bring the blue (funding), devs bring the orange (code)</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div class="relative">
					<div class="card p-8 text-center border-2 border-blue-200 hover:border-blue-400 transition-colors duration-300">
						<div class="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
							<span class="text-2xl font-bold text-white">1</span>
						</div>
						<h3 class="text-xl font-semibold text-gray-900 mb-3">Sponsor Posts</h3>
						<p class="text-gray-500">Create bounties with clear specs. Fund them securely via Stripe escrow.</p>
					</div>
					<div class="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
						<svg class="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
						</svg>
					</div>
				</div>

				<div class="relative">
					<div class="card p-8 text-center border-2 border-amber-200 hover:border-amber-400 transition-colors duration-300">
						<div class="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
							<span class="text-2xl font-bold text-white">2</span>
						</div>
						<h3 class="text-xl font-semibold text-gray-900 mb-3">Dev Builds</h3>
						<p class="text-gray-500">Claim the bounty, write the code, submit your pull request.</p>
					</div>
					<div class="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
						<svg class="w-8 h-8 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
						</svg>
					</div>
				</div>

				<div class="card p-8 text-center border-2 border-indigo-200 hover:border-indigo-400 transition-colors duration-300">
					<div class="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
						<span class="text-2xl font-bold text-white">3</span>
					</div>
					<h3 class="text-xl font-semibold text-gray-900 mb-3">Payment Flows</h3>
					<p class="text-gray-500">Sponsor approves the work. Dev gets paid instantly. 100% goes to dev.</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA with Blue + Orange Gradient -->
	<section class="py-20">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="relative overflow-hidden rounded-3xl">
				<div class="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-600"></div>
				<div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0iI255ZmZmZiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00YSJ2djJoLTIvMnptLTQgNHYyaC0ydi0yaDJ6bTgtOGgydjJoLTIvMnptOCA4aDJ2djJoMnYtMm0tNCB6LTQgeDJ6TTMyIDI2djJoLTIvMnptLTQgOHYyaC0ydi0yaDJ6bTggOGgydjJoLTJ2MnptLTQgOHYyaC0ydi0yaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
				<div class="relative p-12 text-center">
					<h2 class="text-3xl font-bold text-white mb-4">Ready to Build Together?</h2>
					<p class="text-blue-100 mb-8 max-w-xl mx-auto text-lg">
						Join the platform where sponsors and developers create amazing open source software together.
					</p>
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<a href="/dashboard/project/new" class="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 hover:scale-105 shadow-lg">
							Start a Project
							<svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
							</svg>
						</a>
						<a href="/explore" class="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-200 hover:scale-105">
							Explore Bounties
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>
