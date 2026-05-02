<script lang="ts">
	import { onMount } from 'svelte';

	let showCalculator = $state(false);
	let bountyAmount = $state(1000);
	let estimatedSavings = $derived(bountyAmount * 0.05); // 5% platform fee savings vs competitors

	let comparisonData = [
		{ feature: 'Platform Fee (Sponsors)', bountyforge: '5%', competitors: '5-12% (Algora/Gitcoin)', savings: 'Competitive' },
		{ feature: 'Fee for Developers', bountyforge: '0%', competitors: '0% (Algora/Opire)', savings: 'Keep 100%' },
		{ feature: 'Escrow Protection', bountyforge: '✅', competitors: '✅ (Resolvr/Gitcoin)', savings: 'Secure' },
		{ feature: 'Payment Method', bountyforge: 'Stripe (Fiat)', competitors: 'Crypto (Gitcoin)', savings: 'Easy access' },
		{ feature: 'Instant Payouts', bountyforge: '✅', competitors: 'Delayed (some)', savings: 'Fast' },
		{ feature: 'GitHub Integration', bountyforge: '✅ Native', competitors: 'Limited', savings: 'Seamless' }
	];

	let faqOpen = $state<number[]>([]);

	function toggleFaq(index: number) {
		if (faqOpen.includes(index)) {
			faqOpen = faqOpen.filter(i => i !== index);
		} else {
			faqOpen = [...faqOpen, index];
		}
	}
</script>

<div class="min-h-screen py-12">
	<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="text-center mb-12 animate-fade-in-up">
			<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-sm font-medium mb-6">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				Transparent Pricing - No Hidden Fees
			</div>
			<h1 class="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
			<p class="text-xl text-gray-600 max-w-2xl mx-auto">
				We take a small fee to keep the platform running. Developers keep 100% of their earnings.
			</p>
		</div>

		<!-- Pricing Cards -->
		<div class="grid md:grid-cols-2 gap-8 mb-16">
		<!-- For Sponsors -->
		<div class="card p-8 relative overflow-hidden group animate-scale-in">
				<div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
				<div class="relative">
					<div class="flex items-center gap-3 mb-4">
						<div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
							<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<h2 class="text-xl font-bold text-gray-900">For Sponsors</h2>
					</div>
					<div class="mb-6">
						<span class="text-4xl font-bold text-gray-900">5%</span>
						<span class="text-gray-500"> per transaction</span>
					</div>
					<ul class="space-y-3 mb-8">
						<li class="flex items-center gap-2 text-gray-600">
							<svg class="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							Post unlimited bounties
						</li>
						<li class="flex items-center gap-2 text-gray-600">
							<svg class="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							Secure escrow payments
						</li>
						<li class="flex items-center gap-2 text-gray-600">
							<svg class="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							Access to developer talent
						</li>
						<li class="flex items-center gap-2 text-gray-600">
							<svg class="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							Dispute resolution support
						</li>
						<li class="flex items-center gap-2 text-gray-600">
							<svg class="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							Milestone tracking
						</li>
					</ul>
					<a href="/sponsor/signup" class="btn-primary-gradient w-full btn-lift justify-center py-3">
						Join as Sponsor
						<svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
					</a>
				</div>
			</div>

		<!-- For Developers -->
		<div class="card p-8 relative overflow-hidden group border-2 border-amber-500 animate-scale-in delay-100">
				<div class="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
				<div class="relative">
					<div class="flex items-center gap-3 mb-4">
						<div class="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
							<svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
								<path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</div>
						<h2 class="text-xl font-bold text-gray-900">For Developers</h2>
					</div>
					<div class="mb-6">
						<span class="text-4xl font-bold text-gray-900">0%</span>
						<span class="text-gray-500"> platform fee</span>
					</div>
					<ul class="space-y-3 mb-8">
						<li class="flex items-center gap-2 text-gray-600">
							<svg class="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							Free to use
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
						<li class="flex items-center gap-2 text-gray-600">
							<svg class="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							Build your portfolio
						</li>
						<li class="flex items-center gap-2 text-gray-600">
							<svg class="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							Skill-based matching
						</li>
					</ul>
					<a href="/dev/signup" class="btn-primary-gradient w-full btn-lift justify-center py-3">
						Join as Developer
						<svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
					</a>
				</div>
			</div>
		</div>

		<!-- Savings Calculator -->
		<div class="card p-8 mb-16 animate-fade-in-up delay-200">
		<button
			type="button"
			onclick={() => showCalculator = !showCalculator}
			class="w-full flex items-center justify-between text-left"
		>
			<h3 class="text-lg font-semibold text-gray-900">Earnings Calculator</h3>
			<svg class="w-5 h-5 text-gray-400 transition-transform duration-200 {showCalculator ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		{#if showCalculator}
			<div class="mt-6 pt-6 border-t border-gray-200" transition:fade>
				<div class="grid md:grid-cols-2 gap-8">
					<div>
						<label for="bountyAmount" class="block text-sm font-medium text-gray-700 mb-2">
							Average Bounty Amount
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
						<div class="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 w-full">
							<div class="text-sm text-gray-600 mb-2">You Keep vs Competitors</div>
							<div class="text-3xl font-bold text-green-600">${bountyAmount - estimatedSavings}</div>
							<div class="text-sm text-gray-500 mt-1">vs ${bountyAmount * 0.9} elsewhere</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- Comparison Table -->
	<div class="mb-16 animate-fade-in-up delay-300">
		<h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose BountyForge?</h2>
		<div class="card overflow-hidden">
			<table class="w-full">
				<thead>
					<tr class="border-b border-gray-200">
						<th class="text-left p-4 font-semibold text-gray-900">Feature</th>
						<th class="text-center p-4 font-semibold text-amber-600">BountyForge</th>
						<th class="text-center p-4 font-semibold text-gray-500">Competitors</th>
						<th class="text-center p-4 font-semibold text-green-600">Savings</th>
					</tr>
				</thead>
				<tbody>
					{#each comparisonData as row, i}
						<tr class="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
							<td class="p-4 text-gray-700">{row.feature}</td>
							<td class="p-4 text-center font-medium text-gray-900">{row.bountyforge}</td>
							<td class="p-4 text-center text-gray-500">{row.competitors}</td>
							<td class="p-4 text-center font-medium text-green-600">{row.savings}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- FAQ -->
	<div class="mb-16 animate-fade-in-up delay-400">
		<h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
		<div class="space-y-4">
		{#each [
			{ q: 'How does the 5% fee work?', a: 'When a sponsor funds a bounty, 5% of the funded amount is retained by BountyForge. The rest goes to the developer upon completion. For example, if a bounty is funded for $1000, the developer receives $950.' },
			{ q: 'Why is it free for developers?', a: 'We believe developers should keep 100% of their earnings. Our revenue comes from sponsors who find value in the platform. This aligns our incentives with getting work done.' },
			{ q: 'How are payments protected?', a: 'Funds are held in escrow until work is completed and approved by the sponsor. This protects both parties. If there\'s a dispute, our resolution process ensures fair outcomes.' },
			{ q: 'Can I post bounties as needed?', a: 'Pricing is per-transaction, so there are no subscriptions to manage. Just post bounties as needed, and only pay the 5% fee when you fund them.' }
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
		<div class="absolute inset-0 bg-gradient-to-br from-amber-600 to-orange-600"></div>
		<div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2MmgtMnYtMnptLTQgNHYyaC0ydi0yaDJ6bTgtOGgydjJoLTJ2LTJ6bS04IDhoMnYyaC0ydi0yek0zMiAyNnYyaC0ydi0yaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
		<div class="relative p-12 text-center">
			<h2 class="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
			<p class="text-amber-100 mb-8 max-w-2xl mx-auto text-lg">
				Join developers and sponsors building the next generation of open source software. Start your journey today.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a href="/dev/signup" class="inline-flex items-center justify-center px-8 py-3 bg-white text-amber-600 font-semibold rounded-lg hover:bg-amber-50 transition-all duration-200 hover:scale-105 shadow-lg">
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
