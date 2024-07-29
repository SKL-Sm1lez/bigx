import { InjectFlags } from '../@enums/inject-flags.enum';
import type { InjectableDeclaration, InjectableType } from '../@types/inject.types';
import { defineInjectable } from '../helpers/define-injectable';

interface InjectionTokenOptions<T = unknown> {
	factory: () => T;
}

export class InjectionToken<T = unknown> implements InjectableType<T> {
	public readonly __injectable__: InjectableDeclaration<T>;

	constructor(
		private readonly description: string,
		options?: InjectionTokenOptions<T>,
	) {
		this.__injectable__ = defineInjectable({
			...(options ?? {}),
			flags: InjectFlags.Injectable,
		});
	}

	public toString(): string {
		return `InjectionToken ${this.description}`;
	}
}
