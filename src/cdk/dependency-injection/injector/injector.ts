import { InjectFlags } from '../@enums/inject-flags.enum';
import type { OnDestroy } from '../@types/hooks.types';
import type { InjectFlagsDictionary } from '../@types/inject-flags.types';
import type { Provide, Token } from '../@types/inject.types';
import type { Provider, ProvidersCollection } from '../@types/providers.types';
import type { Record } from '../@types/records.types';
import { CIRCULAR, NOT_YET, THROW_IF_NOT_FOUND, VOID_NOT_FOUND } from '../constants/behavior.const';
import { INJECTOR_TOKEN } from '../constants/token.const';
import { providesPath } from '../context/provide-paths';
import { runInContext } from '../context/run-in-context';
import { convertToBitFlags } from '../helpers/convert-to-bit-flags';
import { defineInjectable } from '../helpers/define-injectable';
import { getInjectableFromProvide } from '../helpers/get-injectable-from-provide';
import { getTokenFromProvider } from '../helpers/get-token-from-provider';
import { hasOnDestroy } from '../helpers/has-on-destroy';
import { isTypeProvider } from '../helpers/is';
import { makeRecord } from '../helpers/make-record';
import { providerToFactory, providerToRecord, provideToRecord } from '../helpers/provider-to';
import type { BaseInjector } from './base-injector';
import { nullInjector } from './null-injector';
import { runtimeError } from '@cdk/errors';
import { platform } from '@cdk/platform';
import { deepForEach, isString, run, stringify } from '@cdk/utils';

interface InjectorOptions {
	providers: ProvidersCollection;
	parent?: BaseInjector;
	scopes?: string[];
}

export class Injector implements BaseInjector {
	public static readonly __injectable__ = defineInjectable({
		flags: InjectFlags.Injectable,
		customToken: INJECTOR_TOKEN,
	});

	public static create(options: InjectorOptions): Injector {
		return new Injector(options);
	}

	private readonly onDestroyHooks: OnDestroy[] = [];
	private readonly records = new Map<Token, Record>();

	private readonly parent: BaseInjector;
	private readonly scopes: Set<string>;

	private isDestroyed: boolean = false;

	constructor(options: InjectorOptions) {
		deepForEach(options.providers, (provider) => {
			this.processProvider(provider as Provider);
		});

		this.records.set(INJECTOR_TOKEN, makeRecord(undefined, this));

		this.parent = options.parent || nullInjector;

		if (platform.isDevMode && options.scopes?.length && !options.scopes.every(isString)) {
			throw runtimeError(
				'Injector',
				'Scopes must be an array of strings',
				`current: ${stringify(options.scopes)}`,
			);
		}

		this.scopes = new Set(options.scopes || []);
	}

	public get<T>(
		provide: Provide<T>,
		flags?: InjectFlags | InjectFlagsDictionary,
		notFoundValue: unknown = THROW_IF_NOT_FOUND,
	): T {
		this.assertNotDestroyed();

		const injectable = getInjectableFromProvide(provide);
		const token = injectable.token;
		const bitFlags = convertToBitFlags(flags);

		if (!(bitFlags & InjectFlags.SkipSelf)) {
			let record = this.records.get(token) ?? null;

			if (!record && injectable.provideIn && this.scopes.has(injectable.provideIn)) {
				record = provideToRecord(provide);
			}

			if (record !== null) {
				const isInitial = providesPath.hasProvideQueue;
				providesPath.addProvide(provide);

				try {
					return this.resolveRecord(record, provide) as T;
				} finally {
					if (isInitial) providesPath.clear();
				}
			}
		}

		const nextInjector = !(bitFlags & InjectFlags.Self) ? this.parent : nullInjector;

		if (bitFlags & InjectFlags.Optional && notFoundValue === THROW_IF_NOT_FOUND) {
			notFoundValue = VOID_NOT_FOUND;
		}

		return nextInjector.get(provide, undefined, notFoundValue);
	}

	public destroy(): void {
		this.assertNotDestroyed();

		this.isDestroyed = true;

		try {
			const len = this.onDestroyHooks.length;

			for (let i = 0; i < len; i++) {
				const service = this.onDestroyHooks[i];
				service.onDestroy();
			}
		} finally {
			this.records.clear();
			this.scopes.clear();
			this.onDestroyHooks.length = 0;
		}
	}

	private processProvider<T = unknown>(provider: Provider<T>): void {
		const token = getTokenFromProvider(provider);

		if (!isTypeProvider(provider) && provider.multi === true) {
			let multiRecord = this.records.get(token);

			if (multiRecord) {
				if (multiRecord.multi === undefined) {
					throw new Error('Invalid multi provider');
				}
			} else {
				multiRecord = makeRecord(undefined, NOT_YET, true);

				multiRecord.factory = function () {
					return this.multi!.map(run);
				};

				this.records.set(token, multiRecord);
			}

			const factory = providerToFactory(provider);
			multiRecord.multi!.push(factory);
			return;
		}

		const record = providerToRecord(provider);
		this.records.set(token, record);
	}

	private resolveRecord<T>(record: Record<T>, provide: Provide): T {
		if (record.value === CIRCULAR) {
			throw runtimeError(
				'Injector',
				`Found circular dependency for ${stringify(provide)} provide`,
				`Path: ${providesPath.getCircularPath(provide)}`,
			);
		}

		if (record.value === NOT_YET) {
			record.value = CIRCULAR;
			record.value = runInContext<T>(this, () => record.factory!());

			if (hasOnDestroy(record.value)) {
				this.onDestroyHooks.push(record.value);
			}
		}

		return record.value as T;
	}

	private assertNotDestroyed(): void {
		if (this.isDestroyed) {
			throw runtimeError('Injector', 'Injector has already been destroyed');
		}
	}
}
