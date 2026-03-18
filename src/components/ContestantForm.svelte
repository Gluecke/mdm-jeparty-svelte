<script lang="ts">
	import { doc, setDoc } from 'firebase/firestore';
	import { Timestamp } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import type { Guess } from '$lib/types';
	import { onMount } from 'svelte';
	import { UserRound, MessageCircleQuestionMark, Send, CircleCheck } from 'lucide-svelte';

	let { onNameSet }: { onNameSet?: (name: string) => void } = $props();

	let name = $state('');
	let guess = $state('');
	let guessInput: HTMLInputElement | undefined = $state();
	let submitted = $state(false);

	// Load saved name from localStorage and auto-focus guess if name is pre-filled
	if (typeof localStorage !== 'undefined') {
		try {
			const saved = JSON.parse(localStorage.getItem('contestant') ?? 'null');
			if (saved?.name) {
				name = saved.name;
			}
		} catch {
			// ignore
		}
	}

	onMount(() => {
		if (name && guessInput) {
			guessInput.focus();
		}
	});

	async function submit() {
		if (!name.trim() || !guess.trim()) return;

		const guessData: Guess = {
			contestant: { name: name.trim(), guess: guess.trim() },
			showAnswer: false,
			dateSubmitted: Timestamp.fromDate(new Date())
		};

		try {
			submitted = true;
			setTimeout(() => (submitted = false), 2000);
			onNameSet?.(name.trim());
			await setDoc(doc(db, 'guesses', name.trim()), guessData);
			localStorage.setItem('contestant', JSON.stringify({ name: name.trim() }));
		} catch (error) {
			console.error('Error submitting guess:', error);
		}
	}
</script>

<form class="flex flex-col gap-3" onsubmit={(e) => { e.preventDefault(); submit(); }}>
	<div class="flex flex-col">
		<label for="contestant-name" class="text-sm text-gray-500">Name</label>
		<div class="flex items-center border-b border-gray-400 focus-within:border-blue-500">
			<input
				id="contestant-name"
				type="text"
				autocomplete="off"
				bind:value={name}
				required
				class="flex-1 py-2 text-lg focus:outline-none"
			/>
			<UserRound size={18} class="text-gray-400" />
		</div>
	</div>
	<div class="flex flex-col">
		<label for="contestant-guess" class="text-sm text-gray-500">Guess</label>
		<div class="flex items-center border-b border-gray-400 focus-within:border-blue-500">
			<input
				id="contestant-guess"
				type="text"
				autocomplete="off"
				bind:value={guess}
				bind:this={guessInput}
				required
				class="flex-1 py-2 text-lg focus:outline-none"
			/>
			<MessageCircleQuestionMark size={18} class="text-gray-400" />
		</div>
		<span class="text-xs text-gray-400 mt-0.5">Only one answer</span>
	</div>
	<div class="flex justify-end items-center gap-2">
		{#if submitted}
			<CircleCheck size={22} class="text-green-500" />
		{/if}
		<button
			type="submit"
			disabled={!name.trim() || !guess.trim()}
			class="bg-gray-800 hover:bg-gray-700 disabled:bg-gray-300 text-white rounded-full p-2 transition-colors"
			title="Submit answer"
		>
			<Send size={20} />
		</button>
	</div>
</form>
