import type { InjectFlags } from '../@enums/inject-flags.enum';
import type { InjectFlagsDictionary } from '../@types/inject-flags.types';
import type { Provide } from '../@types/inject.types';
import { THROW_IF_NOT_FOUND, VOID_NOT_FOUND } from '../constants/behavior.const';
import { providesPath } from '../context/provide-paths';
import type { BaseInjector } from './base-injector';
import { runtimeError } from '@cdk/errors';
import { stringify } from '@cdk/utils';

class NullInjector implements BaseInjector {
	public get<T>(
		provide: Provide<T>,
		_flags?: InjectFlags | InjectFlagsDictionary,
		notFoundValue?: unknown,
	): T {
		providesPath.clear();

		if (notFoundValue === THROW_IF_NOT_FOUND) {
			throw runtimeError('NullInjector', `No provider for "${stringify(provide)}"`);
		}

		return (notFoundValue === VOID_NOT_FOUND ? undefined : notFoundValue) as T;
	}

	public destroy(): void {
		// no-op
	}
}

export const nullInjector = new NullInjector();
