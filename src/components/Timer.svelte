<script lang="ts">
	import { doc, setDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { countdownValue } from '$lib/stores/countdown';
	import { Timer } from 'lucide-svelte';

	let startValue = $state(60);
	let localValue = $state<number | undefined>(undefined);
	let intervalId: ReturnType<typeof setInterval> | undefined;

	function startCountdown() {
		if (!startValue || startValue < 0) {
			alert('Please enter a valid positive number.');
			return;
		}

		if (intervalId !== undefined) {
			clearInterval(intervalId);
		}

		localValue = startValue;
		writeToFirestore(localValue);

		intervalId = setInterval(() => {
			if (localValue! > 0) {
				localValue!--;
				writeToFirestore(localValue!);
			} else {
				localValue = 0;
				writeToFirestore(0);
				clearInterval(intervalId);
				intervalId = undefined;
			}
		}, 1000);
	}

	function writeToFirestore(value: number) {
		setDoc(doc(db, 'countdown', 'countdown'), { value }, { merge: true }).catch((error) => {
			console.error('Error writing countdown to Firestore:', error);
		});
	}
</script>

<div class="w-full text-center">
	<div class="flex items-center justify-center gap-2">
		<div class="flex flex-col items-start">
			<label for="timer-input" class="text-xs text-gray-500">Timer</label>
			<input
				id="timer-input"
				type="number"
				bind:value={startValue}
				min="1"
				autocomplete="off"
				class="border-b border-gray-400 w-16 text-center focus:outline-none focus:border-blue-500"
			/>
		</div>
		<button
			onclick={startCountdown}
			class="bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 shadow-md cursor-pointer transition-colors"
			title="Start timer"
		>
			<Timer size={20} />
		</button>
	</div>
	{#if $countdownValue !== null}
		<p class="text-4xl mt-2 {$countdownValue === 0 ? 'text-red-600' : 'text-gray-800'}">
			{$countdownValue}
		</p>
	{/if}
</div>
