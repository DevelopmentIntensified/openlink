<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>OpenLink - Open Source Project & Bounty Platform</title>
</svelte:head>

<div class="min-h-screen bg-gray-950">
	<header class="border-b border-gray-800">
		<nav class="container mx-auto px-4 py-4 flex items-center justify-between">
			<a href="/" class="text-xl font-bold text-white">OpenLink</a>
			<div class="flex items-center gap-4">
				<a href="/explore" class="text-gray-300 hover:text-white transition-colors">Explore</a>
				{#if form?.user}
					<a href="/dashboard" class="text-gray-300 hover:text-white transition-colors">Dashboard</a>
					<a href="/profile/{form.user.username}" class="text-gray-300 hover:text-white transition-colors">Profile</a>
					<form method="POST" action="/logout" use:enhance>
						<button type="submit" class="text-gray-300 hover:text-white transition-colors">Logout</button>
					</form>
				{:else}
					<a href="/login" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">Sign In</a>
				{/if}
			</div>
		</nav>
	</header>

	<main>
		<section class="py-20 text-center">
			<h1 class="text-5xl font-bold text-white mb-6">
				Support Open Source,<br />Get Features Built
			</h1>
			<p class="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
				OpenLink connects open source maintainers with companies and individuals who want to fund specific features, bug fixes, or improvements.
			</p>
			<div class="flex items-center justify-center gap-4">
				<a href="/explore" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
					Browse Projects
				</a>
				<a href="/login" class="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors border border-gray-700">
					Add Your Project
				</a>
			</div>
		</section>

		<section class="py-16 bg-gray-900/50">
			<div class="container mx-auto px-4">
				<h2 class="text-2xl font-bold text-white mb-8 text-center">How It Works</h2>
				<div class="grid md:grid-cols-3 gap-8">
					<div class="p-6 bg-gray-900 rounded-xl border border-gray-800">
						<div class="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
							<span class="text-2xl">1</span>
						</div>
						<h3 class="text-lg font-semibold text-white mb-2">Publish Your Project</h3>
						<p class="text-gray-400">List your open source project and describe what it does. Opt into the bounty program to start earning.</p>
					</div>
					<div class="p-6 bg-gray-900 rounded-xl border border-gray-800">
						<div class="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
							<span class="text-2xl">2</span>
						</div>
						<h3 class="text-lg font-semibold text-white mb-2">Create Bounties</h3>
						<p class="text-gray-400">Anyone can create a bounty for a feature they want, offering payment to the developer who implements it.</p>
					</div>
					<div class="p-6 bg-gray-900 rounded-xl border border-gray-800">
						<div class="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
							<span class="text-2xl">3</span>
						</div>
						<h3 class="text-lg font-semibold text-white mb-2">Get Paid</h3>
						<p class="text-gray-400">Developers claim bounties, complete the work, and get paid through our secure payment system.</p>
					</div>
				</div>
			</div>
		</section>

		<section class="py-16">
			<div class="container mx-auto px-4 text-center">
				<h2 class="text-2xl font-bold text-white mb-4">Why OpenLink?</h2>
				<div class="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
					<div class="text-left">
						<h3 class="text-lg font-semibold text-white mb-2">For Maintainers</h3>
						<ul class="space-y-2 text-gray-400">
							<li>• Get paid for your open source work</li>
							<li>• Only opt into bounties when you want</li>
							<li>• Maintain full control of your project</li>
						</ul>
					</div>
					<div class="text-left">
						<h3 class="text-lg font-semibold text-white mb-2">For Companies</h3>
						<ul class="space-y-2 text-gray-400">
							<li>• Fund features you need in OSS projects</li>
							<li>• Support the developers you rely on</li>
							<li>• Get results, not just promises</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
	</main>

	<footer class="border-t border-gray-800 py-8">
		<div class="container mx-auto px-4 text-center text-gray-500">
			<p>&copy; 2026 OpenLink. Built for the open source community.</p>
		</div>
	</footer>
</div>
