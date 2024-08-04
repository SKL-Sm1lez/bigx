import type { BaseEnvironment } from './base-environment';

export class EnvironmentManager implements BaseEnvironment {
	public readonly isBrowser = !!(
		typeof window !== 'undefined' &&
		typeof window.document &&
		typeof window.document.createElement
	);
}
