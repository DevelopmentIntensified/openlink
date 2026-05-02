<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let name = $state('');
	let description = $state('');
	let repoUrl = $state('');
	let website = $state('');
	let category = $state('web');
	let type = $state('individual');
	let isBountyEnabled = $state(false);
	let isSubmitting = $state(false);

	let categories = [
		{ value: 'web', label: 'Web Development', icon: '🌐' },
		{ value: 'mobile', label: 'Mobile', icon: '📱' },
		{ value: 'desktop', label: 'Desktop', icon: '🖥️' },
		{ value: 'backend', label: 'Backend', icon: '⚙️' },
		{ value: 'devops', label: 'DevOps', icon: '🔧' },
		{ value: 'data', label: 'Data Science', icon: '📊' },
		{ value: 'security', label: 'Security', icon: '🔒' },
		{ value: 'other', label: 'Other', icon: '📦' }
	];

	let types = [
		{ value: 'individual', label: 'Solo Developer', desc: 'Just you working on this project' },
		{ value: 'team', label: 'Team Project', desc: 'Working with a dev team' },
		{ value: 'community', label: 'Community', desc: 'Open source community project' }
	];

	async function handleSubmit() {
		isSubmitting = true;
		// Form submission is handled by enhance
	}
</script>

{#if data.user}
	<div class="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-12 px-4">
		<div class="max-w-3xl mx-auto">
			<!-- Header -->
			<div class="text-center mb-12 animate-fade-in-up">
				<div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center animate-float">
					<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0h-3m-2-7a2 2 0 012-2h6a2 2 0 012 2m-6 7V5a2 2 0 012-2h6a2 2 0 012 2v4a2 2 0 01-2 2h-6a2 2 0 00-2 2" />
					</svg>
				</div>
				<h1 class="text-4xl font-bold text-gray-900 mb-4">Forge a New Project</h1>
				<p class="text-xl text-gray-600">Create your project and start funding features you need</p>
			</div>

			<!-- Form Card -->
			<form
				method="POST"
				use:enhance
				class="card p-8 space-y-6 animate-scale-in"
				onsubmit={handleSubmit}
			>
				<!-- Project Name -->
				<div class="group">
					<label for="name" class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
						<svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
						</svg>
						Project Name *
					</label>
					<div class="relative">
						<input
							type="text"
							id="name"
							name="name"
							bind:value={name}
							required
							class="input pl-10 transition-all duration-300 focus:pl-4 focus:border-amber-500"
							placeholder="My Awesome Project"
						/>
						<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.657A4 4 0 017 7m2 0a4 4 0 002 7.466V10" />
						</svg>
					</div>
				</div>

				<!-- Description -->
				<div>
					<label for="description" class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
						<svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2-4a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2a2 2 0 012-2m2-4V5a2 2 0 012-2h6a2 2 0 012 2v2" />
						</svg>
						Description
					</label>
					<textarea
						id="description"
						name="description"
						bind:value={description}
						rows="3"
						class="input resize-none"
						placeholder="Describe what your project does and what problems it solves..."
					></textarea>
				</div>

				<!-- Two Column Layout -->
				<div class="grid md:grid-cols-2 gap-6">
					<!-- Repository URL -->
					<div>
						<label for="repoUrl" class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
							<svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.385.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.385-1.332-1.752-1.332-1.752-1.089-.744.084-.729.084-.729 1.205.084 1.839 1.236 1.839 1.236 1.07 1.834 2.809 1.304 3.495.997.107-.775.418-1.305.762-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.465-2.381 1.23-3.221-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.006.404 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.221 0 4.61-2.807 5.625-5.475 5.92.429.372.81 1.102.81 2.22v3.293c0 .319.252.694.793.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
							</svg>
							Repository URL
						</label>
						<input
							type="url"
							id="repoUrl"
							name="repoUrl"
							bind:value={repoUrl}
							class="input"
							placeholder="https://github.com/user/repo"
						/>
					</div>

					<!-- Website -->
					<div>
						<label for="website" class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
							<svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m0 18a3 3 0 006 0m-6 0a3 3 0 016 0m0 0a3 3 0 016 0m-6 0a3 3 0 016 0" />
							</svg>
							Website
						</label>
						<input
							type="url"
							id="website"
							name="website"
							bind:value={website}
							class="input"
							placeholder="https://myproject.dev"
						/>
					</div>
				</div>

				<!-- Category -->
				<div>
					<label for="category" class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
						<svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
						</svg>
						Category
					</label>
					<div class="grid grid-cols-2 md:grid-cols-4 gap-3">
						{#each categories as cat}
							<label class="relative">
								<input
									type="radio"
									name="category"
									value={cat.value}
									bind:group={category}
									class="peer absolute opacity-0 w-0 h-0"
								/>
								<div class="cursor-pointer rounded-xl border-2 border-gray-200 p-4 text-center transition-all duration-300 peer-checked:border-amber-500 peer-checked:bg-amber-50 hover:border-amber-300 hover:bg-amber-50/50">
									<div class="text-2xl mb-1">{cat.icon}</div>
									<div class="text-sm font-medium text-gray-700">{cat.label}</div>
								</div>
							</label>
						{/each}
					</div>
				</div>

				<!-- Project Type -->
				<div>
					<label for="type" class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
						<svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
						Project Type
					</label>
					<div class="grid md:grid-cols-3 gap-4">
						{#each types as t}
							<label class="relative">
								<input
									type="radio"
									name="type"
									value={t.value}
									bind:group={type}
									class="peer absolute opacity-0 w-0 h-0"
								/>
								<div class="cursor-pointer rounded-xl border-2 border-gray-200 p-5 transition-all duration-300 peer-checked:border-amber-500 peer-checked:bg-gradient-to-br peer-checked:from-amber-50 peer-checked:to-orange-50 hover:border-amber-300 hover:shadow-md">
									<h3 class="font-semibold text-gray-900 mb-1">{t.label}</h3>
									<p class="text-sm text-gray-600">{t.desc}</p>
								</div>
							</label>
						{/each}
					</div>
				</div>

				<!-- Bounties Toggle -->
				<div class="card bg-gradient-to-r from-amber-50 to-orange-50 p-6 border-amber-200">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
								<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<div>
								<h3 class="font-semibold text-gray-900">Enable Bounties</h3>
								<p class="text-sm text-gray-600">Allow sponsors to fund features for this project</p>
							</div>
						</div>
						<button
							type="button"
							onclick={() => isBountyEnabled = !isBountyEnabled}
							aria-label="Toggle bounty funding"
							class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 {isBountyEnabled ? 'bg-amber-600' : 'bg-gray-200'}"
						>
							<input type="hidden" name="isBountyEnabled" value={isBountyEnabled ? 'on' : ''} />
							<span
								class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 {isBountyEnabled ? 'translate-x-6' : 'translate-x-1'}"
							></span>
						</button>
					</div>
				</div>

				<!-- Submit Button -->
				<div class="flex items-center justify-between pt-6 border-t border-gray-200">
					<a href="/dashboard" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
						← Back to Dashboard
					</a>
					<button
						type="submit"
						disabled={isSubmitting || !name}
						class="btn-primary-gradient btn-lift px-8 py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if isSubmitting}
							<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Creating...
						{:else}
							<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
							</svg>
							Forge Project
						{/if}
					</button>
				</div>
			</form>
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
			<p class="text-gray-600 mb-8">Please sign in to create a new project and start forging.</p>
			<a href="/login" class="btn-primary-gradient btn-lift w-full justify-center">
				Sign In
				<svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
				</svg>
			</a>
		</div>
	</div>
{/if}
