import { writable } from 'svelte/store';

export const user = writable(null);
export const timerStore = writable(null);
export const toast = writable(null);