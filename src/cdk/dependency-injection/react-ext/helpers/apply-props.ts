import type { TypeProvider } from '../../@types/providers.types';
import type { ControllerPropsOptions } from '../@types/controller.types';
import { runtimeError } from '@cdk/errors';
import { platform } from '@cdk/platform';
import { hasOwn, stringify } from '@cdk/utils';

interface ApplyPropsConfig<T extends {}> {
	controller: TypeProvider<unknown>;
	expectedProperties: ControllerPropsOptions[];
	instance: Record<string, unknown>;
	initialProps: T;
}

export const applyProps = <T extends {}>({
	controller,
	expectedProperties,
	instance,
	initialProps,
}: ApplyPropsConfig<T>): void => {
	for (let i = 0; i < expectedProperties.length; i++) {
		const { propertyKey, redefineKey, required } = expectedProperties[i];

		if (platform.isDevMode && required && !hasOwn(initialProps, redefineKey || propertyKey)) {
			throw runtimeError(
				stringify(controller),
				redefineKey
					? `Missing required redefined "${redefineKey}" property`
					: `Missing required "${propertyKey}" property`,
				'Initial props:',
				JSON.stringify(initialProps, null, 4),
			);
		}

		const key = redefineKey ?? propertyKey;
		instance[propertyKey] = initialProps[key as keyof T];
	}
};
