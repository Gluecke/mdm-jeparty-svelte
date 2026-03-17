<script lang="ts">
	import type { Guess } from '$lib/types';

	let { guess, currentName }: { guess: Guess; currentName: string } = $props();

	const isOwn = $derived(guess.contestant.name === currentName);
</script>

<div class="border rounded-lg p-4 bg-white shadow-sm {isOwn ? 'border-blue-400 ring-1 ring-blue-300' : 'border-gray-200'}">
	<div class="font-semibold text-lg text-gray-800">{guess.contestant.name}</div>
	<div class="mt-1 text-lg">
		{#if guess.showAnswer}
			{guess.contestant.guess}
		{:else if isOwn}
			<span class="text-gray-400 italic">{guess.contestant.guess}</span>
		{:else}
			<span class="text-gray-400 italic">answer hidden</span>
		{/if}
	</div>
</div>
