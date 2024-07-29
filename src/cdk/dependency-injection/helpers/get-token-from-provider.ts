import type { Token } from '../@types/inject.types';
import type { Provider } from '../@types/providers.types';
import { getInjectableFromProvide } from './get-injectable-from-provide';
import { isTypeProvider } from './is';

export const getTokenFromProvider = <T>(provider: Provider<T>): Token => {
	const provide = isTypeProvider(provider) ? provider : provider.provide;
	return getInjectableFromProvide(provide).token;
};
