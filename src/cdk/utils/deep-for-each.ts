import { isArray } from './is';

export const deepForEach = <T extends unknown[]>(arr: T, callback: (value: T[number]) => void) => {
	const len = arr.length;

	for (let i = 0; i < len; i++) {
		if (isArray(arr[i])) {
			deepForEach(arr[i] as T, callback);
		} else {
			callback(arr[i]);
		}
	}
};
