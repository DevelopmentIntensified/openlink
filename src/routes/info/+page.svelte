<script lang="ts">
</script>

<svelte:head>
	<title>About - OpenLink</title>
	<meta name="description" content="Learn about OpenLink - the platform connecting developers with open source funding" />
</svelte:head>

<div class="min-h-screen bg-gray-50 py-12">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
			<h1 class="text-4xl font-bold text-gray-900 mb-4">About OpenLink</h1>
			<p class="text-xl text-gray-600">
				OpenLink is a platform that connects open source developers with sponsors who want to fund meaningful work.
			</p>
		</div>

		<div class="grid md:grid-cols-2 gap-6">
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div class="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
					<svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 mb-2">Fund Bounties</h3>
				<p class="text-gray-600">
					Sponsors can post bounties for specific features, bug fixes, or improvements to their open source projects.
				</p>
			</div>

			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div class="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center mb-4">
					<svg class="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 mb-2">Build OSS</h3>
				<p class="text-gray-600">
					Developers can find meaningful work, get paid for their contributions, and build their portfolio.
				</p>
			</div>

			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
					<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 mb-2">Secure Payments</h3>
				<p class="text-gray-600">
					Funds are held in escrow until work is completed and approved. Everyone is protected.
				</p>
			</div>

			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div class="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
					<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 mb-2">Community</h3>
				<p class="text-gray-600">
					Connect with other developers, share knowledge, and grow together in the open source community.
				</p>
			</div>
		</div>

		<div class="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg p-8 mt-8 text-white">
			<h2 class="text-2xl font-bold mb-4">Get Started</h2>
			<p class="text-teal-100 mb-6">
				Join hundreds of developers and sponsors already using OpenLink to build the future of open source.
			</p>
			<div class="flex flex-col sm:flex-row gap-4">
				<a href="/auth/signup" class="inline-flex items-center justify-center px-6 py-3 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gray-100 transition">
					Sign Up
				</a>
				<a href="/explore" class="inline-flex items-center justify-center px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition">
					Explore Bounties
				</a>
			</div>
		</div>
	</div>
</div>
