import { hasOwn } from './has-own';
import { isArray, isObjectLike } from './is';

export const isEqual = (a: unknown, b: unknown): boolean => {
	if (Object.is(a, b)) {
		return true;
	}

	if (isObjectLike(a) && isObjectLike(b)) {
		if (a.constructor !== b.constructor) {
			return false;
		}

		let length;
		let i;
		let keys;

		if (isArray(a)) {
			length = a.length;

			if (length !== (b as unknown[]).length) {
				return false;
			}

			for (i = length; i-- !== 0; ) {
				if (!isEqual(a[i], (b as unknown[])[i])) {
					return false;
				}
			}

			return true;
		}

		if (a instanceof Map && b instanceof Map) {
			if (a.size !== b.size) {
				return false;
			}

			for (i of a.entries()) {
				if (!b.has(i[0])) {
					return false;
				}
			}

			for (i of a.entries()) {
				if (!isEqual(i[1], b.get(i[0]))) {
					return false;
				}
			}

			return true;
		}

		if (a instanceof Set && b instanceof Set) {
			if (a.size !== b.size) {
				return false;
			}

			for (i of a.entries()) {
				if (!b.has(i[0])) {
					return false;
				}
			}

			return true;
		}

		if (ArrayBuffer && ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
			length = (a as any).length;

			if (length !== (b as any).length) {
				return false;
			}

			for (i = length; i-- !== 0; ) {
				if ((a as any) !== (b as any)[i]) {
					return false;
				}
			}

			return true;
		}

		if (a.constructor === RegExp) {
			return (a as any).source === (b as any).source && (a as any).flags === (b as any).flags;
		}

		if (a.valueOf !== Object.prototype.valueOf) {
			return a.valueOf() === b.valueOf();
		}

		if (a.toString !== Object.prototype.toString) {
			return a.toString() === b.toString();
		}

		keys = Object.keys(a);
		length = keys.length;

		if (length !== Object.keys(b).length) {
			return false;
		}

		for (i = length; i-- !== 0; ) {
			if (!hasOwn(b, keys[i])) {
				return false;
			}
		}

		for (i = length; i-- !== 0; ) {
			const key = keys[i];

			if (!isEqual((a as any)[key], (b as any)[key])) {
				return false;
			}
		}

		return true;
	}

	return Number.isNaN(a) && Number.isNaN(b);
};
