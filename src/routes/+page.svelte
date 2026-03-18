<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { doc, getDoc, setDoc } from 'firebase/firestore';
	import { onAuthStateChanged } from 'firebase/auth';
	import { db, auth } from '$lib/firebase';
	import { guesses, subscribeGuesses } from '$lib/stores/guesses';
	import { guessVisibility, subscribeVisibility } from '$lib/stores/visibility';
	import { subscribeCountdown } from '$lib/stores/countdown';
	import Header from '$components/Header.svelte';
	import Footer from '$components/Footer.svelte';
	import Splash from '$components/Splash.svelte';
	import ContestantForm from '$components/ContestantForm.svelte';
	import Timer from '$components/Timer.svelte';
	import GuessCard from '$components/GuessCard.svelte';
	import HostControls from '$components/HostControls.svelte';
	import { Download } from 'lucide-svelte';

	let unsubGuesses: (() => void) | undefined;
	let unsubVisibility: (() => void) | undefined;
	let unsubCountdown: (() => void) | undefined;

	let currentName = $state('');

	if (typeof localStorage !== 'undefined') {
		try {
			const saved = JSON.parse(localStorage.getItem('contestant') ?? 'null');
			if (saved?.name) currentName = saved.name;
		} catch {
			// ignore
		}
	}

	let unsubAuth: (() => void) | undefined;
	let loading = $state(true);

	onMount(() => {
		unsubAuth = onAuthStateChanged(auth, async (user) => {
			if (!user) return;

			// Ensure guessVisibility doc exists
			const visDocRef = doc(db, 'guessVisibility', '1');
			const snap = await getDoc(visDocRef);
			if (!snap.exists()) {
				await setDoc(visDocRef, { show: false });
			}

			unsubGuesses = subscribeGuesses();
			unsubVisibility = subscribeVisibility();
			unsubCountdown = subscribeCountdown();

			loading = false;
			unsubAuth?.();
		});
	});

	onDestroy(() => {
		unsubAuth?.();
		unsubGuesses?.();
		unsubVisibility?.();
		unsubCountdown?.();
	});

	function downloadAnswers() {
		const rows = $guesses.map(
			(g) => `${g.contestant.name},${g.showAnswer ? g.contestant.guess : '********'}`
		);
		const blob = new Blob([rows.join('\r\n')], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'answers.csv';
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<div class="flex flex-col min-h-screen bg-gray-50">
	<Header />
	<Splash />

	<main class="flex flex-1 gap-6 p-6">
		{#if loading}
			<div class="flex flex-1 items-center justify-center">
				<div class="flex flex-col items-center gap-3 text-gray-500">
					<div class="w-10 h-10 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
					<span class="text-sm">Connecting...</span>
				</div>
			</div>
		{:else}
			<!-- Left column -->
			<div class="w-1/2 flex flex-col gap-6">
				<HostControls />
				<ContestantForm onNameSet={(n) => (currentName = n)} />
				<Timer />
			</div>

			<!-- Right column -->
			<div class="w-1/2 flex flex-col gap-4">
				<div class="text-center font-semibold text-gray-700">
					Answers: {$guesses.length}
				</div>
				<hr class="border-gray-300" />
				<div class="flex flex-col gap-3 overflow-y-auto flex-1">
					{#each $guesses as guess (guess.id)}
						<GuessCard {guess} {currentName} />
					{/each}
				</div>
				<button
					onclick={downloadAnswers}
					class="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white rounded p-3 transition-colors w-full"
					title="Download Answers"
				>
					<Download size={22} />
				</button>
			</div>
		{/if}
	</main>

	<Footer />
</div>
