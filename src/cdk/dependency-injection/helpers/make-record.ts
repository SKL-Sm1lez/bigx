import type { Record } from '../@types/records.types';

const EMPTY_FUNCTION = <T>() => void 0 as T;

export const makeRecord = <T>(
	factory: (() => T) | undefined,
	value: T | symbol,
	multi: boolean = false,
): Record<T> => ({
	factory: factory ?? EMPTY_FUNCTION,
	value: value,
	multi: multi ? [] : undefined,
});
