import type { Provide } from '../@types/inject.types';
import type { ValueProvider } from '../@types/providers.types';
import { getClosureSafeProperty } from '@cdk/utils';

export const USE_VALUE = getClosureSafeProperty<ValueProvider>({
	provide: null as unknown as Provide,
	useValue: getClosureSafeProperty,
});
