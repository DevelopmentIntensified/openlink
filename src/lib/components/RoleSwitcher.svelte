<script lang="ts">
	import { getRoles } from '$lib/server/rbac';
	import { goto } from '$app/navigation';
	import {
		canSwitchRole,
		getCurrentRole,
		getSwitchTarget,
		getSwitchPath,
		getAvailableRoles
	} from '$lib/server/rbac/role-switcher';
	import { page } from '$app/stores';

	$: user = $page.data.user;
	$: userRoles = user ? getRoles(user) : [];
	$: switchable = canSwitchRole(userRoles);
	$: currentRole = getCurrentRole($page.url.pathname);
	$: targetRole = switchable ? getSwitchTarget(currentRole || 'dev') : null;
	$: availableRoles = getAvailableRoles(userRoles);

	function onSwitch() {
		if (targetRole) {
			const newPath = getSwitchPath($page.url.pathname, targetRole);
			goto(newPath);
		}
	}
</script>

{#if switchable && currentRole}
	<div class="role-switcher">
		<span>Currently viewing as: <strong>{currentRole}</strong></span>
		<button on:click={onSwitch}>
			Switch to {targetRole}
		</button>
	</div>
{/if}

<style>
	.role-switcher {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.5rem 1rem;
		background: #f5f5f5;
		border-radius: 4px;
	}
	button {
		padding: 0.25rem 0.75rem;
		background: #0070f3;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
</style>
