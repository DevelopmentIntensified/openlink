<script lang="ts">
	let { data } = $props();
	let user = $derived(data.user);
	let projects = $derived(data.projects);
	let createdBounties = $derived(data.createdBounties);
	let completedBounties = $derived(data.completedBounties);
	
	let skills = $derived(user.skills ? user.skills.split(',').map((s: string) => s.trim()) : []);
</script>

<div class="max-w-4xl mx-auto">
	<div class="bg-white rounded-lg shadow-md p-6 mb-6">
		<div class="flex items-start gap-4">
			{#if user.avatarUrl}
				<img src={user.avatarUrl} alt={user.username} class="w-20 h-20 rounded-full" />
			{:else}
				<div class="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-2xl">
					{user.username.charAt(0).toUpperCase()}
				</div>
			{/if}
			<div>
				<h1 class="text-2xl font-bold">{user.username}</h1>
				{#if user.bio}
					<p class="text-gray-600 mt-1">{user.bio}</p>
				{/if}
				{#if skills.length > 0}
					<div class="flex flex-wrap gap-2 mt-2">
						{#each skills as skill}
							<span class="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded">{skill}</span>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
	
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<div>
			<h2 class="text-xl font-semibold mb-4">Projects ({projects.length})</h2>
			{#if projects.length === 0}
				<p class="text-gray-500">No projects yet.</p>
			{:else}
				<div class="space-y-3">
					{#each projects as project}
						<a href="/project/{project.id}" class="block bg-white rounded-lg shadow p-4 hover:shadow-md">
							<h3 class="font-semibold">{project.name}</h3>
							{#if project.description}
								<p class="text-sm text-gray-600 mt-1">{project.description}</p>
							{/if}
							<div class="flex gap-2 mt-2">
								<span class="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800">{project.type}</span>
								{#if project.isBountyEnabled}
									<span class="px-2 py-0.5 text-xs rounded bg-green-100 text-green-800">Bounties</span>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
		
		<div>
			<h2 class="text-xl font-semibold mb-4">Completed Bounties ({completedBounties.filter((b: any) => b.status === 'paid' || b.status === 'completed').length})</h2>
			{#if completedBounties.length === 0}
				<p class="text-gray-500">No completed bounties yet.</p>
			{:else}
				<div class="space-y-3">
					{#each completedBounties as bounty}
						<div class="bg-white rounded-lg shadow p-4">
							<div class="flex justify-between items-start">
								<div>
									<h3 class="font-semibold">{bounty.title}</h3>
									<span class="px-2 py-0.5 text-xs rounded
										{bounty.status === 'completed' ? 'bg-purple-100 text-purple-800' : ''}
										{bounty.status === 'paid' ? 'bg-gray-100 text-gray-800' : ''}
									">
										{bounty.status}
									</span>
								</div>
								<span class="text-green-700 font-medium">${(bounty.amount / 100).toFixed(2)}</span>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
	
	<div class="mt-6">
		<h2 class="text-xl font-semibold mb-4">Created Bounties ({createdBounties.length})</h2>
		{#if createdBounties.length === 0}
			<p class="text-gray-500">No bounties created yet.</p>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
				{#each createdBounties as bounty}
					<a href="/project/{bounty.projectId}/bounty/{bounty.id}" class="block bg-white rounded-lg shadow p-4 hover:shadow-md">
						<div class="flex justify-between items-start">
							<div>
								<h3 class="font-semibold">{bounty.title}</h3>
								<span class="px-2 py-0.5 text-xs rounded
									{bounty.status === 'open' ? 'bg-green-100 text-green-800' : ''}
									{bounty.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : ''}
									{bounty.status === 'completed' ? 'bg-purple-100 text-purple-800' : ''}
									{bounty.status === 'paid' ? 'bg-gray-100 text-gray-800' : ''}
								">
									{bounty.status}
								</span>
							</div>
							<span class="text-green-700 font-medium">${(bounty.amount / 100).toFixed(2)}</span>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>