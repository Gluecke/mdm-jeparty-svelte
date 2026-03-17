import type { Timestamp } from 'firebase/firestore';

export interface Contestant {
	name: string;
	guess: string;
}

export interface Guess {
	id?: string;
	contestant: Contestant;
	showAnswer: boolean;
	dateSubmitted: Timestamp;
}

export interface GuessVisibility {
	id?: string;
	show: boolean;
}
