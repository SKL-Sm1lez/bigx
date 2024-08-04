import { identity } from '../identity';
import type { Compose } from './@types';

export const compose: Compose = (...fns) => {
	if (!fns.length) {
		return identity;
	}

	return (value) => {
		let result = value;

		for (let i = fns.length - 1; i > -1; i--) {
			const next = fns[i];
			result = next(result);
		}

		return result;
	};
};
