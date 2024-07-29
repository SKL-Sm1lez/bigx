import type { BaseInjector } from '../injector/base-injector';
import { injectorContext } from './injector-context';

export const runInContext = <T>(injector: BaseInjector, callback: () => T): T => {
	const prevInjector = injectorContext.setContext(injector);

	try {
		return callback();
	} finally {
		injectorContext.setContext(prevInjector);
	}
};
