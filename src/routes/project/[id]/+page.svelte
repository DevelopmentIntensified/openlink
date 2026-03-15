<script lang="ts">
	import { enhance } from '$app/forms';
	
	let { data } = $props();
	let project = $derived(data.project);
</script>

<div class="max-w-4xl mx-auto">
	<div class="bg-white rounded-lg shadow-md p-6 mb-6">
		<div class="flex justify-between items-start mb-4">
			<div>
				<h1 class="text-3xl font-bold">{project.name}</h1>
				<div class="flex items-center gap-3 mt-2 text-sm text-gray-500">
					<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded">{project.type}</span>
					<span class="px-2 py-1 bg-gray-100 text-gray-800 rounded">{project.category}</span>
					{#if project.isBountyEnabled}
						<span class="px-2 py-1 bg-green-100 text-green-800 rounded">Bounties Enabled</span>
					{/if}
				</div>
			</div>
			
			{#if project.owner}
				<a href="/profile/{project.owner.username}" class="flex items-center gap-2">
					{#if project.owner.avatarUrl}
						<img src={project.owner.avatarUrl} alt={project.owner.username} class="w-10 h-10 rounded-full" />
					{:else}
						<div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
							{project.owner.username.charAt(0).toUpperCase()}
						</div>
					{/if}
					<span class="text-sm text-gray-600">{project.owner.username}</span>
				</a>
			{/if}
		</div>
		
		{#if project.description}
			<p class="text-gray-700 mb-4">{project.description}</p>
		{/if}
		
		<div class="flex gap-4 text-sm">
			{#if project.repoUrl}
				<a href={project.repoUrl} target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800">
					Repository
				</a>
			{/if}
			{#if project.website}
				<a href={project.website} target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800">
					Website
				</a>
			{/if}
		</div>
	</div>
	
	<div class="flex justify-between items-center mb-4">
		<h2 class="text-xl font-semibold">Bounties ({project.bounties.length})</h2>
		
		{#if project.isBountyEnabled}
			<a href="/dashboard/bounty/new/{project.id}" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
				Create Bounty
			</a>
		{/if}
	</div>
	
	{#if project.bounties.length === 0}
		<div class="bg-white rounded-lg shadow-md p-6 text-center">
			<p class="text-gray-500">No bounties yet.</p>
			{#if project.isBountyEnabled}
				<a href="/dashboard/bounty/new/{project.id}" class="text-indigo-600 hover:text-indigo-800 mt-2 inline-block">
					Create the first bounty
				</a>
			{/if}
		</div>
	{:else}
		<div class="space-y-4">
			{#each project.bounties as bounty}
				<div class="bg-white rounded-lg shadow-md p-4">
					<div class="flex justify-between items-start">
						<div>
							<a href="/project/{project.id}/bounty/{bounty.id}" class="text-lg font-semibold hover:text-indigo-600">
								{bounty.title}
							</a>
							{#if bounty.description}
								<p class="text-gray-600 text-sm mt-1">{bounty.description}</p>
							{/if}
							<div class="flex items-center gap-2 mt-2">
								<span class="px-2 py-0.5 text-xs rounded
									{bounty.status === 'open' ? 'bg-green-100 text-green-800' : ''}
									{bounty.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : ''}
									{bounty.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' : ''}
									{bounty.status === 'completed' ? 'bg-purple-100 text-purple-800' : ''}
									{bounty.status === 'paid' ? 'bg-gray-100 text-gray-800' : ''}
								">
									{bounty.status.replace('_', ' ')}
								</span>
								<span class="px-2 py-0.5 text-xs rounded
									{bounty.priority === 'low' ? 'bg-gray-100 text-gray-800' : ''}
									{bounty.priority === 'medium' ? 'bg-blue-100 text-blue-800' : ''}
									{bounty.priority === 'high' ? 'bg-orange-100 text-orange-800' : ''}
									{bounty.priority === 'urgent' ? 'bg-red-100 text-red-800' : ''}
								">
									{bounty.priority}
								</span>
								<span class="text-sm font-medium text-green-700">
									${(bounty.amount / 100).toFixed(2)}
								</span>
							</div>
						</div>
						<a
							href="/project/{project.id}/bounty/{bounty.id}"
							class="px-3 py-1 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50"
						>
							View
						</a>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>