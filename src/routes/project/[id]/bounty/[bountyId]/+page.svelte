<script lang="ts">
	import { enhance } from '$app/forms';
	
	let { data } = $props();
	let bounty = $derived(data.bounty);
	let isOwner = $derived(data.isOwner);
	let isAssignee = $derived(data.isAssignee);
	let user = $derived(data.user);
	
	let showSubmitForm = $state(false);
</script>

<div class="max-w-4xl mx-auto">
	<div class="mb-4">
		<a href="/project/{bounty.project?.id}" class="text-indigo-600 hover:text-indigo-800">
			← Back to {bounty.project?.name}
		</a>
	</div>
	
	<div class="bg-white rounded-lg shadow-md p-6 mb-6">
		<div class="flex justify-between items-start mb-4">
			<div>
				<h1 class="text-2xl font-bold">{bounty.title}</h1>
				<div class="flex items-center gap-2 mt-2">
					<span class="px-2 py-1 text-sm rounded
						{bounty.status === 'open' ? 'bg-green-100 text-green-800' : ''}
						{bounty.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : ''}
						{bounty.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' : ''}
						{bounty.status === 'completed' ? 'bg-purple-100 text-purple-800' : ''}
						{bounty.status === 'paid' ? 'bg-gray-100 text-gray-800' : ''}
					">
						{bounty.status.replace('_', ' ')}
					</span>
					<span class="px-2 py-1 text-sm rounded
						{bounty.priority === 'low' ? 'bg-gray-100 text-gray-800' : ''}
						{bounty.priority === 'medium' ? 'bg-blue-100 text-blue-800' : ''}
						{bounty.priority === 'high' ? 'bg-orange-100 text-orange-800' : ''}
						{bounty.priority === 'urgent' ? 'bg-red-100 text-red-800' : ''}
					">
						{bounty.priority} priority
					</span>
				</div>
			</div>
			<div class="text-right">
				<p class="text-3xl font-bold text-green-700">${(bounty.amount / 100).toFixed(2)}</p>
			</div>
		</div>
		
		{#if bounty.description}
			<p class="text-gray-700 mb-4">{bounty.description}</p>
		{/if}
		
		{#if bounty.skills}
			<div class="mb-4">
				<p class="text-sm text-gray-500 mb-1">Required Skills:</p>
				<div class="flex flex-wrap gap-2">
					{#each bounty.skills.split(',') as skill}
						<span class="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded">{skill.trim()}</span>
					{/each}
				</div>
			</div>
		{/if}
		
		{#if bounty.deadline}
			<p class="text-sm text-gray-500">
				Deadline: {new Date(bounty.deadline).toLocaleDateString()}
			</p>
		{/if}
	</div>
	
	{#if bounty.project}
		<div class="bg-white rounded-lg shadow-md p-6 mb-6">
			<h2 class="text-lg font-semibold mb-2">Project</h2>
			<a href="/project/{bounty.project.id}" class="text-indigo-600 hover:text-indigo-800">
				{bounty.project.name}
			</a>
		</div>
	{/if}
	
	{#if bounty.creator}
		<div class="bg-white rounded-lg shadow-md p-6 mb-6">
			<h2 class="text-lg font-semibold mb-2">Created by</h2>
			<a href="/profile/{bounty.creator.username}" class="flex items-center gap-2">
				{#if bounty.creator.avatarUrl}
					<img src={bounty.creator.avatarUrl} alt={bounty.creator.username} class="w-8 h-8 rounded-full" />
				{:else}
					<div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
						{bounty.creator.username.charAt(0).toUpperCase()}
					</div>
				{/if}
				<span class="text-indigo-600">{bounty.creator.username}</span>
			</a>
		</div>
	{/if}
	
	{#if bounty.assignee}
		<div class="bg-white rounded-lg shadow-md p-6 mb-6">
			<h2 class="text-lg font-semibold mb-2">Assigned to</h2>
			<a href="/profile/{bounty.assignee.username}" class="flex items-center gap-2">
				{#if bounty.assignee.avatarUrl}
					<img src={bounty.assignee.avatarUrl} alt={bounty.assignee.username} class="w-8 h-8 rounded-full" />
				{:else}
					<div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
						{bounty.assignee.username.charAt(0).toUpperCase()}
					</div>
				{/if}
				<span class="text-indigo-600">{bounty.assignee.username}</span>
			</a>
		</div>
	{/if}
	
	{#if bounty.status === 'submitted' && bounty.submissionPR}
		<div class="bg-white rounded-lg shadow-md p-6 mb-6">
			<h2 class="text-lg font-semibold mb-2">Submission</h2>
			<p class="mb-2">
				<a href={bounty.submissionPR} target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800">
					{bounty.submissionPR}
				</a>
			</p>
			{#if bounty.submissionNotes}
				<p class="text-gray-600">{bounty.submissionNotes}</p>
			{/if}
		</div>
	{/if}
	
	{#if user && bounty.status === 'open'}
		<form method="POST" action="?/claim" use:enhance>
			<button type="submit" class="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700">
				Claim This Bounty
			</button>
		</form>
	{/if}
	
	{#if isAssignee && bounty.status === 'in_progress'}
		{#if !showSubmitForm}
			<button onclick={() => showSubmitForm = true} class="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
				Submit Work
			</button>
		{:else}
			<form method="POST" action="?/submit" use:enhance class="space-y-4">
				<div>
					<label for="prLink" class="block text-sm font-medium text-gray-700">
						PR/MR Link <span class="text-red-500">*</span>
					</label>
					<input
						type="url"
						id="prLink"
						name="prLink"
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
						placeholder="https://github.com/..."
					/>
				</div>
				<div>
					<label for="notes" class="block text-sm font-medium text-gray-700">
						Notes
					</label>
					<textarea
						id="notes"
						name="notes"
						rows="3"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
						placeholder="Any additional notes..."
					></textarea>
				</div>
				<button type="submit" class="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
					Submit
				</button>
			</form>
		{/if}
	{/if}
	
	{#if isOwner && bounty.status === 'submitted'}
		<form method="POST" action="?/complete" use:enhance>
			<button type="submit" class="w-full py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700">
				Approve & Mark Complete
			</button>
		</form>
	{/if}
</div>