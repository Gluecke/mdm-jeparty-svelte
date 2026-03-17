import { writable } from 'svelte/store';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '$lib/firebase';

export const guessVisibility = writable<boolean>(false);

export function subscribeVisibility(): () => void {
	return onSnapshot(doc(db, 'guessVisibility', '1'), (snap) => {
		if (snap.exists()) {
			guessVisibility.set(snap.data().show as boolean);
		}
	});
}
