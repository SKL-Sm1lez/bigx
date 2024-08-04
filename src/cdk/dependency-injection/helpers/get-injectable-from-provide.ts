import type { InjectableDeclaration, InjectableProvide, Provide } from '../@types/inject.types';
import { isInjectable } from './is';
import { runtimeError } from '@cdk/errors';
import { platform } from '@cdk/platform';
import { stringify } from '@cdk/utils';

export const getInjectableFromProvide = <T>(provide: Provide<T>): InjectableDeclaration<T> => {
	if (platform.isDevMode && !isInjectable(provide)) {
		throw runtimeError(
			'Injector',
			`This provide -> ${stringify(provide)}`,
			'is not "Injectable"',
			`You must use "new InjectionToken()" or "@Injectable() class ${stringify(provide)} {}" as provide`,
		);
	}

	return (provide as InjectableProvide<any>).__injectable__;
};
