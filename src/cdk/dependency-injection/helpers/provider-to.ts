import type { Provide } from '../@types/inject.types';
import type { Provider } from '../@types/providers.types';
import type { Record } from '../@types/records.types';
import { NOT_YET } from '../constants/behavior.const';
import { inject, injectDeps } from '../context/inject';
import { getDepsFromType } from './get-deps-from-type';
import { isExistingProvider, isFactoryProvider, isTypeProvider, isValueProvider } from './is';
import { makeRecord } from './make-record';
import type { Type } from '@cdk/@types';
import { runtimeError } from '@cdk/errors';
import { platform } from '@cdk/platform';
import { isFunction, stringify } from '@cdk/utils';

export const providerToFactory = <T = unknown>(provider: Provider<T>): (() => T) => {
	let factory: (() => T) | undefined = undefined;

	if (isTypeProvider(provider)) {
		factory = () => {
			const deps = getDepsFromType(provider);
			return new provider(...injectDeps(deps));
		};
	} else if (isValueProvider(provider)) {
		factory = () => provider.useValue;
	} else if (isFactoryProvider(provider)) {
		factory = () => provider.useFactory(...injectDeps(provider.deps || []));
	} else if (isExistingProvider(provider)) {
		factory = () => inject(provider.useExisting);
	} else {
		factory = () => {
			const type = provider.useClass || (provider.provide as Type<any>);

			if (platform.isDevMode && !isFunction(type)) {
				throw runtimeError(
					'Injector',
					'Provider:',
					JSON.stringify(
						Object.entries(provider).reduce(
							(acc, [key, value]) => {
								(acc as any)[key] = stringify(value);
								return acc;
							},
							{ ...provider },
						),
						null,
						4,
					),
					`property -> ${provider.useClass ? 'useClass' : 'provide'}`,
					'must be "@Injectable() class Foo {}"',
				);
			}

			const deps = getDepsFromType(type);
			return new type(...injectDeps(deps));
		};
	}

	return factory;
};

export const providerToRecord = <T>(provider: Provider<T>): Record<T> => {
	if (isValueProvider(provider)) {
		return makeRecord(undefined, provider.useValue, !!provider.multi);
	}

	if (isTypeProvider(provider)) {
		return makeRecord<T>(providerToFactory(provider), NOT_YET);
	}

	return makeRecord<T>(providerToFactory(provider), NOT_YET, !!provider.multi);
};

export const provideToRecord = <T>(provide: Provide<T>): Record<T> | null => {
	if (!isFunction(provide)) {
		return null;
	}

	return makeRecord<T>(providerToFactory(provide), NOT_YET);
};
