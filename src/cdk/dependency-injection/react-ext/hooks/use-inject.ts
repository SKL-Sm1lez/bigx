import type { InjectFlagsDictionary } from '../../@types/inject-flags.types';
import type { Provide } from '../../@types/inject.types';
import { useInjector } from './use-injector';
import { useConstant } from '@cdk/hooks';

export const useInject = <T>(provide: Provide<T>, flags?: InjectFlagsDictionary): T => {
	const injector = useInjector();
	return useConstant(() => injector.get(provide, flags));
};
