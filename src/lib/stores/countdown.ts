import { writable } from 'svelte/store';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '$lib/firebase';

export const countdownValue = writable<number | null>(null);

export function subscribeCountdown(): () => void {
	return onSnapshot(doc(db, 'countdown', 'countdown'), (snap) => {
		if (snap.exists()) {
			countdownValue.set(snap.data().value as number);
		} else {
			countdownValue.set(null);
		}
	});
}
