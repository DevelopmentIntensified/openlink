<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	
	let { data } = $props();
	
	let bounty = $derived(data.bounty);
	let isOwner = $derived(data.isOwner);
	let isAssignee = $derived(data.isAssignee);
	let user = $derived(data.user);
	
	let showSubmitForm = $state(false);
	let isSubmitting = $state(false);
	
	// Calculate platform fee (1%)
	let platformFee = $derived(() => {
		return Math.round(bounty.amount * 0.01);
	});
	
	let netAmount = $derived(() => {
		return bounty.amount - platformFee();
	});
	
	function formatCurrency(amount: number): string {
		return `$${(amount / 100).toFixed(2)}`;
	}
	
	function getStatusColor(status: string): string {
		const colors: Record<string, string> = {
			open: 'bg-green-100 text-green-800',
			in_progress: 'bg-blue-100 text-blue-800',
			submitted: 'bg-yellow-100 text-yellow-800',
			completed: 'bg-purple-100 text-purple-800',
			paid: 'bg-gray-100 text-gray-800'
		};
		return colors[status] || 'bg-gray-100 text-gray-800';
	}
	
	function getPriorityColor(priority: string): string {
		const colors: Record<string, string> = {
			low: 'bg-gray-100 text-gray-600',
			medium: 'bg-blue-100 text-blue-600',
			high: 'bg-orange-100 text-orange-600',
			urgent: 'bg-red-100 text-red-600'
		};
		return colors[priority] || 'bg-gray-100 text-gray-600';
	}
	
	function parseSkills(skillsStr: string | null): string[] {
		if (!skillsStr) return [];
		try {
			return JSON.parse(skillsStr);
		} catch {
			return skillsStr.split(',').map((s: string) => s.trim());
		}
	}
	
	function handleClaim(e: SubmitEvent) {
		if (!user) {
			goto('/login');
			return;
		}
		
		e.preventDefault();
		const formData = new FormData();
		
		fetch('?/claim', {
			method: 'POST',
			body: formData
		}).then(response => {
			if (response.ok) {
				window.location.reload();
			}
		}).catch(error => {
			console.error('Error claiming bounty:', error);
		});
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		isSubmitting = true;
		
		const formData = new FormData(e.target as HTMLFormElement);
		
		fetch('?/submit', {
			method: 'POST',
			body: formData
		}).then(response => {
			isSubmitting = false;
			if (response.ok) {
				window.location.reload();
			}
		}).catch(error => {
			console.error('Error submitting work:', error);
			isSubmitting = false;
		});
	}

	function handleApprove(action: string) {
		if (!user) {
			goto('/login');
			return;
		}
		
		const formData = new FormData();
		
		fetch(`?/${action}`, {
			method: 'POST',
			body: formData
		}).then(response => {
			if (response.ok) {
				window.location.reload();
			}
		}).catch(error => {
			console.error(`Error with ${action}:`, error);
		});
	}
</script>

{#if bounty}
	<div class="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-8 px-4">
		<div class="max-w-4xl mx-auto">
			<!-- Back Button -->
			<div class="mb-4">
				<a href="/dashboard/bounties" class="text-indigo-600 hover:text-indigo-800 transition-colors">
					← Back to Bounties
				</a>
			</div>
			
			<!-- Main Bounty Card -->
			<div class="card p-8 mb-6 animate-scale-in">
				<div class="flex flex-col md:flex-row justify-between items-start mb-6">
					<div class="flex-1">
						<h1 class="text-3xl font-bold text-gray-900 mb-3">{bounty.title}</h1>
						<div class="flex items-center gap-2 mb-4">
							<span class="px-3 py-1 text-sm rounded-full {getStatusColor(bounty.status)}">
								{bounty.status.replace('_', ' ')}
							</span>
							<span class="px-3 py-1 text-sm rounded-full {getPriorityColor(bounty.priority)}">
								{bounty.priority} priority
							</span>
						</div>
					</div>
					<div class="text-right">
						<p class="text-4xl font-bold text-amber-600">{formatCurrency(bounty.amount)}</p>
						<p class="text-sm text-gray-500 mt-1">Reward Amount</p>
					</div>
				</div>
				
				{#if bounty.description}
					<div class="mb-6">
						<h2 class="text-lg font-semibold text-gray-900 mb-2">Description</h2>
						<p class="text-gray-700 leading-relaxed">{bounty.description}</p>
					</div>
				{/if}
				
				{#if bounty.skills}
					<div class="mb-6">
						<h2 class="text-lg font-semibold text-gray-900 mb-2">Required Skills</h2>
						<div class="flex flex-wrap gap-2">
							{#each parseSkills(bounty.skills) as skill (skill)}
								<span class="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-sm font-medium">
									{skill}
								</span>
							{/each}
						</div>
					</div>
				{/if}
				
				{#if bounty.deadline}
					<div class="mb-6 p-4 bg-amber-50 rounded-lg">
						<p class="text-sm text-gray-600">
							<svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							Deadline: <span class="font-semibold text-gray-900">{new Date(bounty.deadline).toLocaleDateString()}</span>
						</p>
					</div>
				{/if}
				
				<!-- Platform Fee Info -->
				<div class="border-t border-gray-100 pt-6 mb-6">
					<h2 class="text-lg font-semibold text-gray-900 mb-3">Payment Breakdown</h2>
					<div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4">
						<div class="flex justify-between items-center mb-2">
							<span class="text-gray-600">Bounty Amount</span>
							<span class="font-semibold text-gray-900">{formatCurrency(bounty.amount)}</span>
						</div>
						<div class="flex justify-between items-center mb-2">
							<span class="text-gray-600">Platform Fee (1%)</span>
							<span class="font-semibold text-amber-600">-{formatCurrency(platformFee())}</span>
						</div>
						<div class="flex justify-between items-center pt-2 border-t border-amber-200">
							<span class="font-semibold text-gray-900">Developer Receives</span>
							<span class="text-xl font-bold text-green-600">{formatCurrency(netAmount())}</span>
						</div>
					</div>
				</div>
				
				<!-- Action Buttons -->
				<div class="space-y-3">
					{#if user && bounty.status === 'open'}
						<form onsubmit={handleClaim}>
							<button
								type="submit"
								class="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center btn-lift"
							>
								<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 012 2" />
								</svg>
								Claim This Bounty
							</button>
						</form>
					{/if}
					
					{#if isAssignee && bounty.status === 'in_progress'}
						{#if !showSubmitForm}
							<button
								onclick={() => showSubmitForm = true}
								class="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center btn-lift"
							>
								<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								Submit Work
							</button>
						{:else}
							<form
								onsubmit={handleSubmit}
								class="space-y-4"
							>
								<div>
									<label for="prLink" class="block text-sm font-medium text-gray-700 mb-2">
										PR/MR Link <span class="text-red-500">*</span>
									</label>
									<input
										type="url"
										id="prLink"
										name="prLink"
										required
										class="input w-full"
										placeholder="https://github.com/..."
									/>
								</div>
								<div>
									<label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
										Notes
									</label>
									<textarea
										id="notes"
										name="notes"
										rows="3"
										class="input w-full"
										placeholder="Any additional notes..."
									></textarea>
								</div>
								<button
									type="submit"
									disabled={isSubmitting}
									class="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center btn-lift disabled:opacity-50"
								>
									{#if isSubmitting}
										<svg class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
											<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
											<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
									{/if}
									Submit Work
								</button>
							</form>
						{/if}
					{/if}
					
					{#if isOwner && bounty.status === 'submitted'}
						<div class="flex gap-3">
							<form onsubmit={() => { handleApprove('approve'); return false; }} class="flex-1">
								<button
									type="submit"
									class="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center btn-lift"
								>
									<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
									</svg>
									Approve & Complete
								</button>
							</form>
							<form onsubmit={() => { handleApprove('reject'); return false; }} class="flex-1">
								<button
									type="submit"
									class="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center btn-lift"
								>
									<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
									</svg>
									Reject & Reopen
								</button>
							</form>
						</div>
					{/if}
				</div>
			</div>
			
			<!-- Project Info -->
			{#if bounty.project}
				<div class="card p-6 mb-6 animate-fade-in-up" style="animation-delay: 0.1s;">
					<h2 class="text-lg font-semibold mb-3">Project</h2>
					<a href="/project/{bounty.project.id}" class="flex items-center gap-3 text-indigo-600 hover:text-indigo-800 transition-colors">
						<div class="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold">
							{bounty.project.name.charAt(0).toUpperCase()}
						</div>
						<span class="font-medium">{bounty.project.name}</span>
						<svg class="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</a>
				</div>
			{/if}
			
			<!-- Creator Info -->
			{#if bounty.creator}
				<div class="card p-6 mb-6 animate-fade-in-up" style="animation-delay: 0.2s;">
					<h2 class="text-lg font-semibold mb-3">Created by</h2>
					<a href="/profile/{bounty.creator.username}" class="flex items-center gap-3 text-indigo-600 hover:text-indigo-800 transition-colors">
						{#if bounty.creator.image}
							<img src={bounty.creator.image} alt={bounty.creator.username} class="w-10 h-10 rounded-full" />
						{:else}
							<div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold">
								{bounty.creator.username.charAt(0).toUpperCase()}
							</div>
						{/if}
						<span class="font-medium">{bounty.creator.username}</span>
						<svg class="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</a>
				</div>
			{/if}
			
			<!-- Assignee Info -->
			{#if bounty.assignee}
				<div class="card p-6 mb-6 animate-fade-in-up" style="animation-delay: 0.3s;">
					<h2 class="text-lg font-semibold mb-3">Assigned to</h2>
					<a href="/profile/{bounty.assignee.username}" class="flex items-center gap-3 text-indigo-600 hover:text-indigo-800 transition-colors">
						{#if bounty.assignee.image}
							<img src={bounty.assignee.image} alt={bounty.assignee.username} class="w-10 h-10 rounded-full" />
						{:else}
							<div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold">
								{bounty.assignee.username.charAt(0).toUpperCase()}
							</div>
						{/if}
						<span class="font-medium">{bounty.assignee.username}</span>
						<svg class="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</a>
				</div>
			{/if}
			
			<!-- Submission Info -->
			{#if bounty.status === 'submitted' && bounty.submissionPR}
				<div class="card p-6 animate-fade-in-up" style="animation-delay: 0.4s;">
					<h2 class="text-lg font-semibold mb-3">Submission</h2>
					<p class="mb-3">
						<svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
						</svg>
						<a href={bounty.submissionPR} target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800">
							{bounty.submissionPR}
						</a>
					</p>
					{#if bounty.submissionNotes}
						<p class="text-gray-700">{bounty.submissionNotes}</p>
					{/if}
				</div>
			{/if}
		</div>
	</div>
{/if}
