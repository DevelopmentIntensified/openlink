<script lang="ts">
	import { getSignupRole } from '$lib/shared/signup-utils';
	import type { SignupData } from '$lib/shared/signup-utils';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let name = $state('');
	let errors: string[] = $state([]);
	let isSubmitting = $state(false);
	let showPassword = $state(false);

	let role = $derived(getSignupRole('/sponsor/signup'));

	async function handleSubmit(e: SubmitEvent) {
		isSubmitting = true;
		errors = [];

		const data: SignupData = {
			email,
			password,
			name,
			role: role || 'sponsor'
		};

		try {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});

			const result = await response.json();

			if (!result.success) {
				errors = result.errors || ['Signup failed'];
				isSubmitting = false;
			} else {
				goto('/sponsor/onboarding');
			}
		} catch (error) {
			errors = ['An unexpected error occurred'];
			isSubmitting = false;
		}
	}
</script>

<div class="min-h-screen flex">
	<!-- Left Side - Branding -->
	<div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-700 relative overflow-hidden">
		<div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2MmgtMnYtMmgyem0wLTRhDJ2MmgtMnYtMnptLTQgNHYyaC0ydi0yaDJ6bTgtOGgydjJoLTJ2LTJ6bS04IDhoMnYyaC0ydi0yek0zMiAyNnYyaC0ydi0yaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

		<div class="relative z-10 flex flex-col justify-center px-12 xl:px-20">
			<div class="mb-12 animate-fade-in-up">
				<div class="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 animate-float">
					<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
					</svg>
				</div>
				<h1 class="text-5xl xl:text-6xl font-bold text-white mb-4">Fund Innovation</h1>
				<p class="text-xl text-blue-100 leading-relaxed">
					Join as a sponsor. Support the open source projects you depend on and fund the features you need.
				</p>
			</div>

			<div class="space-y-6 animate-fade-in-up delay-200">
				<div class="flex items-start gap-4">
					<div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
						<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
						</svg>
					</div>
					<div>
						<h3 class="text-lg font-semibold text-white mb-1">Lightning Fast Results</h3>
						<p class="text-blue-100 text-sm">Get features built quickly by skilled developers</p>
					</div>
				</div>

				<div class="flex items-start gap-4">
					<div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
						<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
					</div>
					<div>
						<h3 class="text-lg font-semibold text-white mb-1">Secure & Transparent</h3>
						<p class="text-blue-100 text-sm">Escrow payments with milestone tracking</p>
					</div>
				</div>

				<div class="flex items-start gap-4">
					<div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
						<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
						</svg>
					</div>
					<div>
						<h3 class="text-lg font-semibold text-white mb-1">Access Top Talent</h3>
						<p class="text-blue-100 text-sm">Connect with vetted open source developers</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Right Side - Signup Form -->
	<div class="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-12 bg-gray-50">
		<div class="w-full max-w-md animate-fade-in-up">
			<!-- Mobile Logo -->
			<div class="lg:hidden flex items-center gap-2 mb-8">
				<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
					<svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
						<path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</div>
				<span class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">BountyForge</span>
			</div>

			<div class="mb-8">
				<h2 class="text-3xl font-bold text-gray-900 mb-2">Join as Sponsor</h2>
				<p class="text-gray-600">Start funding the features you need</p>
			</div>

			<form onsubmit={handleSubmit} class="space-y-5">
				<!-- Name -->
				<div>
					<label for="name" class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
						<svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
						</svg>
						Full Name / Company
					</label>
					<div class="relative">
						<input
							type="text"
							id="name"
							bind:value={name}
							required
							class="input pl-10 transition-all duration-300 focus:pl-4"
							placeholder="Acme Corp"
						/>
						<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
						</svg>
					</div>
				</div>

				<!-- Email -->
				<div>
					<label for="email" class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
						<svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
						</svg>
						Email Address
					</label>
					<div class="relative">
						<input
							type="email"
							id="email"
							bind:value={email}
							required
							class="input pl-10 transition-all duration-300 focus:pl-4"
							placeholder="you@company.com"
						/>
						<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
						</svg>
					</div>
				</div>

				<!-- Password -->
				<div>
					<label for="password" class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
						<svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v3m0 0v3m0-3h3m-3 0h-3m3-3v-3m0 0v-3m0 3h-3m3 0h3M3 10h18M7 15h1m4 0h1m-5 4h1m4 0h1M7 3h4a2 2 0 012 2v4a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"/>
						</svg>
						Password
					</label>
					<div class="relative">
						<input
							type={showPassword ? 'text' : 'password'}
							id="password"
							bind:value={password}
							required
							minlength="8"
							class="input pl-10 pr-10 transition-all duration-300 focus:pl-4"
							placeholder="••••••••"
						/>
						<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v3m0 0v3m0-3h3m-3 0h-3m3-3v-3m0 0v-3m0 3h-3m3 0h3M3 10h18M7 15h1m4 0h1m-5 4h1m4 0h1M7 3h4a2 2 0 012 2v4a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"/>
						</svg>
						<button
							type="button"
							onclick={() => showPassword = !showPassword}
							class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
						>
							{#if showPassword}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.973 9.973 0 011.563-3.029m5.858.908a3 3 0 114.243-4.243m4.243-4.242a3.5 3.5 0 00-4.243-4.243m4.243 4.242L4.22 4.222"/>
								</svg>
							{:else}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
								</svg>
							{/if}
						</button>
					</div>
					<p class="mt-2 text-xs text-gray-500">Must be at least 8 characters</p>
				</div>

				<!-- Error Messages -->
				{#if errors.length > 0}
					<div class="card bg-red-50 border-red-200 p-4 animate-scale-in">
						<div class="flex items-start gap-3">
							<svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
							</svg>
							<div class="flex-1">
								{#each errors as error}
									<p class="text-sm text-red-700">{error}</p>
								{/each}
							</div>
						</div>
					</div>
				{/if}

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={isSubmitting || !email || !password || !name}
					class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 text-base font-semibold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg btn-lift"
				>
					{#if isSubmitting}
						<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Creating Account...
					{:else}
						<svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
						</svg>
						Create Sponsor Account
					{/if}
				</button>
			</form>

			<!-- Login Link -->
			<p class="mt-8 text-center text-sm text-gray-600">
				Already have an account?
				<a href="/login" class="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
					Sign in →
				</a>
			</p>
		</div>
	</div>
</div>
