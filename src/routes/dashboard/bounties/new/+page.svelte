<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	
	let { data } = $props();
	let projects = $derived(data.projects || []);

	let title = $state('');
	let description = $state('');
	let amountDollars = $state('');
	let skills = $state('');
	let priority = $state('medium');
	let deadline = $state('');
	let projectId = $state('');

	let errors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);

	let selectedSkills = $derived(
		skills
			.split(',')
			.map((s: string) => s.trim())
			.filter((s: string) => s.length > 0)
	);

	function validateForm(): boolean {
		const newErrors: Record<string, string> = {};

		if (!title.trim()) {
			newErrors.title = 'Title is required';
		}

		if (!amountDollars.trim()) {
			newErrors.amount = 'Amount is required';
		} else {
			const amount = parseFloat(amountDollars);
			if (isNaN(amount) || amount <= 0) {
				newErrors.amount = 'Amount must be a positive number';
			}
		}

		if (!projectId) {
			newErrors.projectId = 'Please select a project';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		
		if (!validateForm()) {
			return;
		}
		
		isSubmitting = true;
		
		try {
			const formData = new FormData();
			formData.append('title', title);
			formData.append('description', description);
			formData.append('amount', String(parseFloat(amountDollars) * 100)); // Convert to cents
			formData.append('skills', skills);
			formData.append('priority', priority);
			formData.append('projectId', projectId);
			if (deadline) {
				formData.append('deadline', deadline);
			}
			
			const response = await fetch('?/create', {
				method: 'POST',
				body: formData
			});
			
			if (response.ok) {
				const result = await response.json();
				goto(`/bounty/${result.bountyId}`);
			} else {
				console.error('Form submission failed:', await response.text());
			}
		} catch (error) {
			console.error('Error submitting form:', error);
		} finally {
			isSubmitting = false;
		}
	}

	// Priority options
	const priorityOptions = [
		{ value: 'low', label: 'Low', color: 'text-gray-600', bg: 'bg-gray-100' },
		{ value: 'medium', label: 'Medium', color: 'text-blue-600', bg: 'bg-blue-100' },
		{ value: 'high', label: 'High', color: 'text-orange-600', bg: 'bg-orange-100' },
		{ value: 'urgent', label: 'Urgent', color: 'text-red-600', bg: 'bg-red-100' }
	];

	// Calculate platform fee (1%)
	let platformFee = $derived(() => {
		const amount = parseFloat(amountDollars) || 0;
		return amount * 0.01;
	});

	let totalWithFee = $derived(() => {
		const amount = parseFloat(amountDollars) || 0;
		return amount + amount * 0.01;
	});
</script>

{#if data.user}
	<div class="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-8 px-4">
		<div class="max-w-3xl mx-auto">
			<!-- Header with floating icons -->
			<div class="relative mb-8 animate-fade-in-up">
				<!-- Floating bounty icons -->
				<div class="absolute inset-0 overflow-hidden pointer-events-none">
					<div class="absolute top-10 left-10 animate-float" style="animation-delay: 0s;">
						<svg class="w-8 h-8 text-amber-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<div class="absolute top-20 right-20 animate-float" style="animation-delay: 1s;">
						<svg class="w-6 h-6 text-orange-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
						</svg>
					</div>
				</div>

				<div class="text-center">
					<div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center animate-float">
						<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
						</svg>
					</div>
					<h1 class="text-4xl font-bold text-gray-900 mb-4">Create New Bounty</h1>
					<p class="text-xl text-gray-600">Offer a reward for completing a task in your project</p>
				</div>
			</div>

			<!-- Form Card -->
				<form
					onsubmit={handleSubmit}
					class="card p-8 animate-scale-in space-y-6"
				>
					<!-- Project Selector -->
					<div>
						<label for="projectId" class="block text-sm font-medium text-gray-700 mb-2">
							Project <span class="text-red-500">*</span>
						</label>
						<select
							id="projectId"
							name="projectId"
							bind:value={projectId}
							class="input w-full"
							class:border-red-500={errors.projectId}
						>
							<option value="" disabled>Select a project...</option>
							{#each projects as project (project.id)}
								<option value={project.id}>{project.name}</option>
							{/each}
						</select>
						{#if errors.projectId}
							<p class="mt-1 text-sm text-red-600">{errors.projectId}</p>
						{/if}
						{#if projects.length === 0}
							<p class="mt-2 text-sm text-gray-500">
								No projects found. <a href="/dashboard/project/new" class="text-amber-600 hover:text-amber-700">Create a project first</a>
							</p>
						{/if}
					</div>

					<!-- Title -->
					<div>
						<label for="title" class="block text-sm font-medium text-gray-700 mb-2">
							Title <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="title"
							name="title"
							bind:value={title}
							placeholder="e.g., Fix login bug, Implement dark mode"
							class="input w-full"
							class:border-red-500={errors.title}
						/>
						{#if errors.title}
							<p class="mt-1 text-sm text-red-600">{errors.title}</p>
						{/if}
					</div>

					<!-- Description -->
					<div>
						<label for="description" class="block text-sm font-medium text-gray-700 mb-2">
							Description
						</label>
						<textarea
							id="description"
							name="description"
							bind:value={description}
							rows="4"
							placeholder="Describe what needs to be done, acceptance criteria, etc."
							class="input w-full"
						></textarea>
					</div>

					<!-- Amount and Priority Row -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<!-- Amount -->
						<div>
							<label for="amount" class="block text-sm font-medium text-gray-700 mb-2">
								Reward Amount (USD) <span class="text-red-500">*</span>
							</label>
							<div class="relative">
								<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
								<input
									type="number"
									id="amount"
									name="amount"
									bind:value={amountDollars}
									placeholder="100"
									step="0.01"
									min="1"
									class="input w-full pl-8"
									class:border-red-500={errors.amount}
								/>
							</div>
							{#if errors.amount}
								<p class="mt-1 text-sm text-red-600">{errors.amount}</p>
							{/if}
							{#if amountDollars && !isNaN(parseFloat(amountDollars))}
								<div class="mt-2 p-3 bg-amber-50 rounded-lg text-sm">
									<p class="text-gray-600">
										Reward: <span class="font-semibold text-gray-900">${parseFloat(amountDollars).toFixed(2)}</span>
									</p>
									<p class="text-gray-500">
										Platform fee (1%): <span class="font-semibold text-amber-600">${platformFee.toFixed(2)}</span>
									</p>
									<p class="text-gray-600 font-semibold">
										Total charge: <span class="text-amber-600">${totalWithFee.toFixed(2)}</span>
									</p>
								</div>
							{/if}
						</div>

						<!-- Priority -->
						<div>
							<label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
								Priority
							</label>
							<select
								id="priority"
								name="priority"
								bind:value={priority}
								class="input w-full"
							>
								{#each priorityOptions as option (option.value)}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
							<div class="mt-2 flex items-center gap-2">
								<span class="text-sm text-gray-500">Selected:</span>
								{#each priorityOptions as option (option.value)}
									{#if option.value === priority}
										<span class="px-2 py-1 text-xs rounded-full {option.bg} {option.color} font-medium">
											{option.label}
										</span>
									{/if}
								{/each}
							</div>
						</div>
					</div>

					<!-- Skills -->
					<div>
						<label for="skills" class="block text-sm font-medium text-gray-700 mb-2">
							Required Skills
						</label>
						<input
							type="text"
							id="skills"
							name="skills"
							bind:value={skills}
							placeholder="e.g., JavaScript, Svelte, CSS (comma-separated)"
							class="input w-full"
						/>
						<p class="mt-1 text-sm text-gray-500">Separate skills with commas</p>
						{#if selectedSkills.length > 0}
							<div class="mt-3 flex flex-wrap gap-2">
								{#each selectedSkills as skill (skill)}
									<span class="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-sm font-medium">
										{skill}
									</span>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Deadline -->
					<div>
						<label for="deadline" class="block text-sm font-medium text-gray-700 mb-2">
							Deadline
						</label>
						<input
							type="date"
							id="deadline"
							name="deadline"
							bind:value={deadline}
							class="input w-full"
							min={new Date().toISOString().split('T')[0]}
						/>
						<p class="mt-1 text-sm text-gray-500">Optional: Set a deadline for this bounty</p>
					</div>

					<!-- Submit Button -->
					<div class="flex items-center justify-between pt-4 border-t border-gray-100">
						<a href="/dashboard/bounties" class="text-gray-600 hover:text-gray-900 transition-colors">
							← Back to Bounties
						</a>
						<button
							type="submit"
							disabled={isSubmitting || projects.length === 0}
							class="btn-primary-gradient btn-lift disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{#if isSubmitting}
								<svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Creating...
							{:else}
								<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
								</svg>
								Create Bounty
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
			<p class="text-gray-600 mb-8">Please sign in to create a bounty.</p>
			<a href="/login" class="btn-primary-gradient btn-lift w-full justify-center">
				Sign In
				<svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
				</svg>
			</a>
		</div>
	</div>
{/if}

<style>
	:global(.input) {
		@apply px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all duration-300;
	}

	:global(.btn-primary-gradient) {
		@apply px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center;
	}

	:global(.btn-lift) {
		@apply transform hover:-translate-y-0.5 hover:shadow-lg;
	}

	:global(.card) {
		@apply bg-white rounded-2xl shadow-md;
	}

	:global(.animate-fade-in-up) {
		animation: fadeInUp 0.6s ease-out forwards;
	}

	:global(.animate-scale-in) {
		animation: scaleIn 0.5s ease-out forwards;
	}

	:global(.animate-float) {
		animation: float 3s ease-in-out infinite;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes scaleIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes float {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}
</style>
