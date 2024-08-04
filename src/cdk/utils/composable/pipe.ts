import { identity } from '../identity';
import type { Pipe } from './@types';

export const pipe: Pipe = (...fns) => {
	if (!fns.length) {
		return identity;
	}

	return (value) => {
		let result = value;

		for (let i = 0; i < fns.length; i++) {
			const next = fns[i];
			result = next(result);
		}

		return result;
	};
};
