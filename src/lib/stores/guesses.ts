import { writable } from 'svelte/store';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '$lib/firebase';
import type { Guess } from '$lib/types';

export const guesses = writable<Guess[]>([]);

export function subscribeGuesses(): () => void {
	return onSnapshot(collection(db, 'guesses'), (snap) => {
		guesses.set(
			snap.docs
				.map((d) => ({ id: d.id, ...d.data() } as Guess))
				.sort((a, b) => a.dateSubmitted.toMillis() - b.dateSubmitted.toMillis())
		);
	});
}
