<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<div class="min-h-screen flex items-center justify-center px-4 py-12">
	<div class="w-full max-w-md">
		<div class="card p-8">
			<div class="text-center mb-8">
				<a href="/" class="inline-flex items-center gap-2 mb-6">
					<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
						<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
						</svg>
					</div>
				</a>
				<h2 class="text-2xl font-bold text-gray-900">Create your account</h2>
				<p class="text-gray-500 mt-2">Start funding and building open source</p>
			</div>

			<!-- OAuth Buttons -->
			<div class="space-y-3 mb-6">
				<a href="/api/auth/signin/github" 
					class="flex w-full items-center justify-center gap-3 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition">
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
						<path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
					</svg>
					Continue with GitHub
				</a>
				
				<a href="/api/auth/signin/google" 
					class="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 border border-gray-300 hover:bg-gray-50 transition">
					<svg class="h-5 w-5" viewBox="0 0 24 24">
						<path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.373-6.053 2.373-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
					</svg>
					Continue with Google
				</a>
			</div>

			<div class="relative mb-6">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-200"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="bg-white px-4 text-gray-500">Or continue with email</span>
				</div>
			</div>

			<form class="space-y-5" method="POST" action="/api/auth/signup/email" use:enhance>
				<div>
					<label for="name" class="block text-sm font-medium text-gray-700 mb-1.5">
						Full name
					</label>
					<input id="name" name="name" type="text" autocomplete="name" required class="input" placeholder="John Doe">
				</div>

				<div>
					<label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">
						Email address
					</label>
					<input id="email" name="email" type="email" autocomplete="email" required class="input" placeholder="you@example.com">
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700 mb-1.5">
						Password
					</label>
					<input id="password" name="password" type="password" autocomplete="new-password" required class="input" placeholder="••••••••">
				</div>

				<div class="flex items-start gap-2">
					<input id="terms" name="terms" type="checkbox" required class="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500">
					<label for="terms" class="text-sm text-gray-600">
						I agree to the <a href="/legal/terms" class="text-teal-600 hover:text-teal-700 underline">Terms of Service</a> and <a href="/legal/privacy" class="text-teal-600 hover:text-teal-700 underline">Privacy Policy</a>
					</label>
				</div>

				<button type="submit" class="btn-primary w-full">
					Create account
				</button>
			</form>

			<p class="text-center text-sm text-gray-500 mt-6">
				Already have an account? <a href="/login" class="font-semibold text-teal-600 hover:text-teal-700">
					Sign in
				</a>
			</p>
		</div>
	</div>
</div>
