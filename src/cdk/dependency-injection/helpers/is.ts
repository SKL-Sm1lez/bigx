import type { InjectableProvide, Provide } from '../@types/inject.types';
import type {
	ClassProvider,
	ExistingProvider,
	FactoryProvider,
	Provider,
	TypeProvider,
	ValueProvider,
} from '../@types/providers.types';
import { USE_VALUE } from '../constants/providers.const';
import { isFunction } from '@cdk/utils';
import { hasOwn } from '@cdk/utils';

export const isInjectable = <T>(provide: Provide<T>): provide is InjectableProvide<T> => {
	return hasOwn(provide, '__injectable__');
};

export const isValueProvider = <T>(provider: Provider<T>): provider is ValueProvider<T> => {
	return hasOwn(provider, USE_VALUE);
};

export const isExistingProvider = <T>(provider: Provider<T>): provider is ExistingProvider<T> => {
	return !!(provider && (provider as ExistingProvider).useExisting);
};

export const isFactoryProvider = <T>(provider: Provider<T>): provider is FactoryProvider<T> => {
	return !!(provider && (provider as FactoryProvider).useFactory);
};

export const isTypeProvider = isFunction as <T>(
	provider: Provider<T>,
) => provider is TypeProvider<T>;

export const isClassProvider = <T>(provider: Provider<T>): provider is ClassProvider<T> => {
	return !!(provider && (provider as ClassProvider).useClass);
};
