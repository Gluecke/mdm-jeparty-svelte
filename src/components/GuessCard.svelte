<script lang="ts">
	import type { Guess } from '$lib/types';

	let { guess, currentName }: { guess: Guess; currentName: string } = $props();

	const isOwn = $derived(guess.contestant.name === currentName);
</script>

<div class="border rounded-lg p-2 bg-white shadow-sm {isOwn && !guess.showAnswer ? 'own-guess' : isOwn ? 'border-blue-400' : 'border-gray-200'}">
	<div class="text-lg font-semibold">
		{#if guess.showAnswer}
			{guess.contestant.guess}
		{:else if isOwn}
			<span class="text-gray-400 italic">{guess.contestant.guess}</span>
		{:else}
			<span class="text-gray-400 italic">answer hidden</span>
		{/if}
	</div>
	<div class="text-lg tracking-wide text-gray-500">{guess.contestant.name}</div>
</div>

<style>
	.own-guess {
		border-color: #60a5fa;
		position: relative;
		overflow: hidden;
	}

	.own-guess::after {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 35%;
		height: 100%;
		background: linear-gradient(
			55deg,
			transparent,
			rgba(210, 210, 230, 0) 25%,
			rgba(210, 210, 230, 0.5) 50%,
			rgba(210, 210, 230, 0) 75%,
			transparent
		);
		animation: shine 3s ease-in-out infinite;
	}

	@keyframes shine {
		0% {
			left: -100%;
		}
		50% {
			left: 150%;
		}
		100% {
			left: 150%;
		}
	}
</style>
