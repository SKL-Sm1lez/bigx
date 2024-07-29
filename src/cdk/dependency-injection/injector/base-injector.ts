import type { InjectFlags } from '../@enums/inject-flags.enum';
import type { InjectFlagsDictionary } from '../@types/inject-flags.types';
import type { Provide } from '../@types/inject.types';

export abstract class BaseInjector {
	public abstract get<T>(
		provide: Provide<T>,
		flags?: InjectFlags | InjectFlagsDictionary,
		notFoundValue?: unknown,
	): T;

	public abstract destroy(): void;
}
