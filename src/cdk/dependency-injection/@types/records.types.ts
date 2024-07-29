export interface Record<T = unknown> {
	factory: () => T;
	value: T | Symbol;
	multi: Array<() => unknown> | undefined;
}
