import { browser } from '$app/environment';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// These are initialized in browser only; callers must guard with `if (browser)`
// or rely on SSR being disabled (ssr = false in +layout.ts).
export let db = null as unknown as ReturnType<typeof getFirestore>;
export let auth = null as unknown as ReturnType<typeof getAuth>;

if (browser) {
	const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
	db = getFirestore(app);
	auth = getAuth(app);

	console.log('VITE_USE_EMULATOR:', import.meta.env.VITE_USE_EMULATOR);
	if (import.meta.env.VITE_USE_EMULATOR === 'true') {
		connectFirestoreEmulator(db, 'localhost', 8080);
		connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
		console.log('Connected to Firebase emulators');
	}

	signInAnonymously(auth).catch((error) => {
		console.error(`anonymous sign in error ${error.code} - ${error.message}`, error);
	});
}
