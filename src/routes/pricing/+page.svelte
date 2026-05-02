<script lang="ts">
	import { onMount } from 'svelte';

	let showCalculator = $state(false);
	let bountyAmount = $state(1000);
	let devEarnings = $derived(bountyAmount * 0.95); // 1% fee
	let platformRevenue = $derived(bountyAmount * 0.01);
</script>

<div class="min-h-screen py-12">
	<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="text-center mb-12 animate-fade-in-up">
			<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-sm font-medium mb-6">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				Simple Pricing - Built for Growth
			</div>
			<h1 class="text-4xl font-bold text-gray-900 mb-4">Fund Work. Get Code.</h1>
			<p class="text-xl text-gray-600 max-w-2xl mx-auto">
				Sponsors pay 1% to keep the platform running. Developers keep 100% of their earnings.
			</p>
		</div>

		<!-- How the Money Flows -->
		<div class="grid md:grid-cols-2 gap-8 mb-16">
			<!-- Sponsor Side (Blue) -->
			<div class="card p-8 relative overflow-hidden group animate-scale-in">
				<div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
				<div class="relative">
					<div class="flex items-center gap-3 mb-6">
						<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div>
							<h2 class="text-xl font-bold text-gray-900">Sponsors Pay</h2>
							<p class="text-sm text-gray-500">1% platform fee</p>
						</div>
					</div>

					<div class="space-y-4 mb-6">
						<div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
							<span class="text-gray-700">Bounty Amount</span>
							<span class="font-bold text-gray-900">$1,000</span>
						</div>
						<div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
							<span class="text-gray-700">Platform Fee (1%)</span>
							<span class="font-bold text-blue-600">-$50</span>
						</div>
						<div class="flex justify-between items-center p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg font-bold">
							<span class="text-gray-900">You Pay</span>
							<span class="text-blue-700">$1,050</span>
						</div>
					</div>

					<ul class="space-y-3">
						<li class="flex items-center gap-2 text-gray-600">
							<svg class="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							Post unlimited bounties
						</li>
						<li class="flex items-center gap-2 text-gray-600">
							<svg class="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							Secure escrow payments
						</li>
						<li class="flex items-center gap-2 text-gray-600">
							<svg class="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							Access to top developers
						</li>
					</ul>
				</div>
			</div>

			<!-- Developer Side (Orange) -->
			<div class="card p-8 relative overflow-hidden group border-2 border-amber-500 animate-scale-in delay-100">
				<div class="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
				<div class="relative">
					<div class="flex items-center gap-3 mb-6">
						<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
							<svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
								<path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</div>
						<div>
							<h2 class="text-xl font-bold text-gray-900">Developers Earn</h2>
							<p class="text-sm text-gray-500">0% platform fee</p>
						</div>
					</div>

					<div class="space-y-4 mb-6">
						<div class="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
							<span class="text-gray-700">Bounty Amount</span>
							<span class="font-bold text-gray-900">$1,000</span>
						</div>
						<div class="flex justify-between items-center p-3 bg-green-50 rounded-lg">
							<span class="text-gray-700">Platform Fee</span>
							<span class="font-bold text-green-600">$0</span>
						</div>
						<div class="flex justify-between items-center p-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg font-bold">
							<span class="text-gray-900">You Keep</span>
							<span class="text-amber-700">$1,000</span>
						</div>
					</div>

					<ul class="space-y-3">
						<li class="flex items-center gap-2 text-gray-600">
							<svg class="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							Free to use, always
						</li>
						<li class="flex items-center gap-2 text-gray-600">
							<svg class="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							Keep 100% of earnings
						</li>
						<li class="flex items-center gap-2 text-gray-600">
							<svg class="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							Instant payouts
						</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- Earnings Calculator -->
		<div class="card p-8 mb-16 animate-fade-in-up delay-200">
			<button
				type="button"
				onclick={() => showCalculator = !showCalculator}
				class="w-full flex items-center justify-between text-left"
			>
				<h3 class="text-lg font-semibold text-gray-900">See the Math</h3>
				<svg class="w-5 h-5 text-gray-400 transition-transform duration-200 {showCalculator ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{#if showCalculator}
				<div class="mt-6 pt-6 border-t border-gray-200" transition:fade>
					<div class="grid md:grid-cols-2 gap-8">
						<div>
							<label for="bountyAmount" class="block text-sm font-medium text-gray-700 mb-2">
								Bounty Amount
							</label>
							<div class="relative">
								<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
								<input
									type="number"
									id="bountyAmount"
									bind:value={bountyAmount}
									min="100"
									max="100000"
									class="input pl-8"
								/>
							</div>
						</div>
						<div class="flex items-center">
							<div class="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 w-full">
								<div class="text-sm text-gray-600 mb-2">Sponsor Pays / Dev Keeps</div>
								<div class="text-3xl font-bold text-gray-900">${bountyAmount}</div>
								<div class="text-sm text-gray-500 mt-1">vs <span class="text-amber-600 font-medium">${devEarnings}</span> kept</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- FAQ -->
		<div class="mb-16 animate-fade-in-up delay-400">
			<h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">Questions? We Got Answers.</h2>
			<div class="space-y-4">
				{#each [
					{ q: 'How does the 1% fee work?', a: 'When a sponsor funds a $1,000 bounty, $50 goes to BountyForge. The developer receives $950. Simple.' },
					{ q: 'Why is it free for developers?', a: 'We believe developers should keep 100% of their earnings. Our revenue comes from sponsors.' },
					{ q: 'How are payments protected?', a: 'Funds are held in escrow until work is completed and approved by the sponsor.' },
					{ q: 'Can I post bounties as needed?', a: 'Pricing is per-transaction. No subscriptions to manage. Just post when you need work done.' }
				] as faq, i}
					<div class="card p-6">
						<button
							type="button"
							onclick={() => toggleFaq(i)}
							class="w-full flex items-center justify-between text-left"
						>
							<span class="font-semibold text-gray-900">{faq.q}</span>
							<svg class="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 {faqOpen.includes(i) ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</button>
						{#if faqOpen.includes(i)}
							<p class="mt-4 text-gray-600 leading-relaxed" transition:fade>
								{faq.a}
							</p>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- Final CTA -->
		<div class="relative overflow-hidden rounded-3xl animate-fade-in-up delay-500">
			<div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600"></div>
			<div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00YSJ2djJoLTIvMnptLTQgNHYyaC0ydi0yaDJ6bTgtOGgydjJoLTIvMnptOCA4aDJ2djJoMnYtMm0LTQgeDJ6TTMyIDI2djJoLTIvMnptLTQgOHYyaC0ydi0yaDJ6bTggOGgydjJoLTJ2MnptLTQgOHYyaC0ydi0yaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
			<div class="relative p-12 text-center">
				<h2 class="text-3xl font-bold text-white mb-4">Ready to Build?</h2>
				<p class="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
					Join developers and sponsors building the next generation of open source software.
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
</div>

<script context="module">
	let faqOpen = $state<number[]>([]);

	function toggleFaq(index: number) {
		if (faqOpen.includes(index)) {
			faqOpen = faqOpen.filter(i => i !== index);
		} else {
			faqOpen = [...faqOpen, index];
		}
	}
</script>
