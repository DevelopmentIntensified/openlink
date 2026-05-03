<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		size = 40,
		class: className = '',
		showText = true,
		textClass = 'text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent',
		href = '/',
		children
	}: {
		size?: number;
		class?: string;
		showText?: boolean;
		textClass?: string;
		href?: string;
		children?: Snippet;
	} = $props();
</script>

<a href={href} class="flex items-center gap-2 group {className}">
	<!-- New Logo: Anvil + Code Bracket combo -->
	<div
		class="relative flex items-center justify-center"
		style="width: {size}px; height: {size}px;"
	>
		<!-- Gradient background circle -->
		<div class="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
		</div>

		<!-- Logo mark: Anvil shape with code brackets -->
		<svg
			class="relative z-10 text-white"
			width={size * 0.6}
			height={size * 0.6}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<!-- Anvil base -->
			<path d="M4 16h16l-2 4H6l-2-4z" fill="currentColor" opacity="0.9"/>
			<!-- Anvil stand -->
			<rect x="9" y="12" width="6" height="4" fill="currentColor" opacity="0.7"/>
			<!-- Code bracket left -->
			<path d="M8 8L4 12l4 4" stroke-width="1.5"/>
			<!-- Code bracket right -->
			<path d="M16 8l4 4-4 4" stroke-width="1.5"/>
			<!-- Spark/lightning -->
			<path d="M12 4l1 3h-2z" fill="currentColor" stroke="none"/>
		</svg>
	</div>

	{#if showText}
		<span class={textClass}>{@render children() || 'BountyForge'}</span>
	{/if}
</a>
