<script lang="ts">
	import { onMount } from 'svelte';

	let statsVisible = $state(false);

	onMount(() => {
		statsVisible = true;
	});
</script>

<div class="min-h-screen">
	<!-- Hero -->
	<div class="relative px-4 sm:px-6 lg:px-8 py-24 sm:py-32 overflow-hidden">
		<div class="absolute inset-0 -z-10">
			<div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50"></div>
			<div class="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30 animate-float" style="animation-delay: 0s;"></div>
			<div class="absolute bottom-0 left-0 translate-y-12 -translate-x-1/4 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30 animate-float" style="animation-delay: 1.5s;"></div>
		</div>

		<div class="max-w-4xl mx-auto text-center relative z-10">
			<h1 class="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-6 animate-fade-in-up">
				Building the Future of <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Open Source</span>
			</h1>

			<p class="text-xl text-gray-600 mb-4 max-w-xl mx-auto leading-relaxed animate-fade-in-up delay-100">
				BountyForge connects sponsors who need features with developers who build them.
			</p>

			<p class="text-lg text-gray-500 mb-10 max-w-xl mx-auto animate-fade-in-up delay-200">
				Simple. Transparent. One low 1% platform fee.
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

	<!-- Mission -->
	<section class="py-20 bg-gradient-to-br from-blue-50/50 to-orange-50/50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid md:grid-cols-2 gap-12 items-center">
				<div class="animate-fade-in-up">
					<h2 class="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
					<p class="text-lg text-gray-600 mb-6 leading-relaxed">
						We believe open source software should be sustainable. Maintainers should be able to fund the features their users need, and developers should be fairly compensated for their work.
					</p>
					<p class="text-lg text-gray-600 mb-6 leading-relaxed">
						BountyForge makes this possible with a simple, transparent platform that charges just <span class="font-bold text-blue-600">1%</span> from sponsors and <span class="font-bold text-amber-600">0%</span> from developers.
					</p>
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div>
							<div class="font-bold text-gray-900">1% Platform Fee</div>
							<div class="text-sm text-gray-500">Only from sponsors</div>
						</div>
					</div>
				</div>

				<div class="animate-fade-in-up delay-200">
					<div class="card p-8 relative overflow-hidden">
						<div class="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-50"></div>
						<div class="relative">
							<h3 class="text-xl font-bold text-gray-900 mb-4">Why 1%?</h3>
							<ul class="space-y-4">
								<li class="flex items-start gap-3">
									<div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
										<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
										</svg>
									</div>
									<span class="text-gray-700">Cover platform costs (hosting, payments, support)</span>
								</li>
								<li class="flex items-start gap-3">
									<div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
										<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
										</svg>
									</div>
									<span class="text-gray-700">Keep the platform running smoothly</span>
								</li>
								<li class="flex items-start gap-3">
									<div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
										<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
										</svg>
									</div>
									<span class="text-gray-700">Developers keep 100% of their earnings</span>
								</li>
								<li class="flex items-start gap-3">
									<div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
										<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
										</svg>
									</div>
									<span class="text-gray-700">Aligned incentives - we grow when you grow</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- How It Works -->
	<section class="py-20">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-16">
				<h2 class="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
				<p class="text-gray-500 max-w-2xl mx-auto">Three simple steps - blue meets orange, sponsors meet developers</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div class="relative">
					<div class="card p-8 text-center border-2 border-blue-200 hover:border-blue-400 transition-colors duration-300">
						<div class="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
							<span class="text-2xl font-bold text-white">1</span>
						</div>
						<h3 class="text-xl font-semibold text-gray-900 mb-3">Sponsor Posts</h3>
						<p class="text-gray-500">Create bounties with clear specs. Fund them securely via Stripe escrow. Just 1% fee.</p>
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
						<p class="text-gray-500">Claim the bounty, write the code, submit your pull request. Keep 100%.</p>
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
					<p class="text-gray-500">Sponsor approves the work. Dev gets paid instantly. Simple as that.</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Values -->
	<section class="py-20 bg-gray-50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-16">
				<h2 class="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div class="card p-8">
					<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-4">
						<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Transparency</h3>
					<p class="text-gray-600">1% fee. No hidden costs. No subscriptions. Simple per-transaction pricing.</p>
				</div>

				<div class="card p-8">
					<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mb-4">
						<svg class="w-6 h-6 text-amber-600" viewBox="0 0 24 24" fill="none">
							<path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Developer First</h3>
					<p class="text-gray-600">Zero fees for developers. Keep 100% of your earnings. Instant payouts.</p>
				</div>

				<div class="card p-8">
					<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center mb-4">
						<svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Community</h3>
					<p class="text-gray-600">Building the next generation of open source software together.</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="py-20">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="relative overflow-hidden rounded-3xl">
				<div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600"></div>
				<div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00YSJ2djJoLTIvMnptLTQgNHYyaC0ydi0yaDJ6bTgtOGgydjJoLTIvMnptOCA4aDJ2djJoMnYtMm0LTQgeDJ6TTMyIDI2djJoLTIvMnptLTQgOHYyaC0ydi0yaDJ6bTggOGgydjJoLTIvMnptLTQgOHYyaC0ydi0yaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
				<div class="relative p-12 text-center">
					<h2 class="text-3xl font-bold text-white mb-4">Ready to Join?</h2>
					<p class="text-blue-100 mb-8 max-w-xl mx-auto text-lg">
						Be part of the platform where sponsors and developers build amazing open source software together.
					</p>
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<a href="/dev/signup" class="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 hover:scale-105 shadow-lg">
							Join as Developer
							<svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
							</svg>
						</a>
						<a href="/sponsor/signup" class="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-200 hover:scale-105">
							Join as Sponsor
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>
