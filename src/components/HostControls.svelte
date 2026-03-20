<script lang="ts">
	import {
		collection,
		deleteDoc,
		doc,
		getDocs,
		updateDoc
	} from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { guessVisibility } from '$lib/stores/visibility';
	import { Eye, EyeOff, RefreshCw } from 'lucide-svelte';

	let togglingVisibility = $state(false);
	let resetting = $state(false);

	async function toggleVisibility() {
		togglingVisibility = true;
		try {
			const toShow = !$guessVisibility;
			const visDocRef = doc(db, 'guessVisibility', '1');
			await updateDoc(visDocRef, { show: toShow });

			const guessesSnap = await getDocs(collection(db, 'guesses'));
			await Promise.all(guessesSnap.docs.map((g) => updateDoc(doc(db, 'guesses', g.id), { showAnswer: toShow })));
		} finally {
			togglingVisibility = false;
		}
	}

	async function reset() {
		resetting = true;
		try {
			const guessesSnap = await getDocs(collection(db, 'guesses'));
			await Promise.all(guessesSnap.docs.map((g) => deleteDoc(doc(db, 'guesses', g.id))));
			await updateDoc(doc(db, 'guessVisibility', '1'), { show: false });
		} finally {
			resetting = false;
		}
	}
</script>

<div class="flex items-center gap-3 flex-wrap">
	<span class="text-sm font-medium text-gray-600">Host Controls:</span>
	<button
		onclick={toggleVisibility}
		disabled={togglingVisibility}
		class="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white p-2 rounded shadow-md cursor-pointer transition-colors"
		title="Show/Hide answers"
	>
		{#if $guessVisibility}
			<Eye size={20} />
		{:else}
			<EyeOff size={20} />
		{/if}
	</button>
	<button
		onclick={reset}
		disabled={resetting}
		class="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white p-2 rounded shadow-md cursor-pointer transition-colors"
		title="Reset"
	>
		<RefreshCw size={20} class={resetting ? 'animate-spin' : ''} />
	</button>
</div>
