import type { BaseEnvironment } from './base-environment';
import { canUseDom } from './helpers/can-use-dom';

export class EnvironmentManager implements BaseEnvironment {
	public readonly isBrowser = canUseDom();
}
