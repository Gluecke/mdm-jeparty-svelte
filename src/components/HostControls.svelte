<script lang="ts">
	import {
		collection,
		deleteDoc,
		doc,
		getDoc,
		getDocs,
		updateDoc
	} from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { guessVisibility } from '$lib/stores/visibility';
	import { Eye, EyeOff, RefreshCw } from 'lucide-svelte';

	async function toggleVisibility() {
		const visDocRef = doc(db, 'guessVisibility', '1');
		const snap = await getDoc(visDocRef);
		if (!snap.exists()) return;

		const toShow = !snap.data().show;
		await updateDoc(visDocRef, { show: toShow });

		const guessesSnap = await getDocs(collection(db, 'guesses'));
		await Promise.all(guessesSnap.docs.map((g) => updateDoc(doc(db, 'guesses', g.id), { showAnswer: toShow })));
	}

	async function reset() {
		const guessesSnap = await getDocs(collection(db, 'guesses'));
		await Promise.all(guessesSnap.docs.map((g) => deleteDoc(doc(db, 'guesses', g.id))));
		await updateDoc(doc(db, 'guessVisibility', '1'), { show: false });
	}
</script>

<div class="flex items-center gap-3 flex-wrap">
	<span class="text-sm font-medium text-gray-600">Host Controls:</span>
	<button
		onclick={toggleVisibility}
		class="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
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
		class="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
		title="Reset"
	>
		<RefreshCw size={20} />
	</button>
</div>
