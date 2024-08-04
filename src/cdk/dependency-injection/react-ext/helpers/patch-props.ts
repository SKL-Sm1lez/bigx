import type { TypeProvider } from '../../@types/providers.types';
import type { ControllerPropsOptions } from '../@types/controller.types';
import { runtimeError } from '@cdk/errors';
import { platform } from '@cdk/platform';
import { hasOwn, stringify } from '@cdk/utils';
import { isEqual as isDeepEqual } from '@cdk/utils/is-equal';

interface PatchPropsConfig<T extends {}> {
	controller: TypeProvider<unknown>;
	expectedProperties: ControllerPropsOptions[];
	instance: Record<string, unknown>;
	prevProps: T;
	nextProps: T;
}

export const patchProps = <T extends {}>({
	controller,
	expectedProperties,
	instance,
	prevProps,
	nextProps,
}: PatchPropsConfig<T>): boolean => {
	let isEqual: boolean = true;
	const expectedLength = expectedProperties.length;
	const verifiedKeys: Record<string, boolean> = {};

	for (let i = 0; i < expectedLength; i++) {
		const { propertyKey, redefineKey, required, deepEqual, equalFn, rerenderDisabled } =
			expectedProperties[i];

		if (platform.isDevMode && required && !hasOwn(nextProps, redefineKey || propertyKey)) {
			throw runtimeError(
				stringify(controller),
				redefineKey
					? `Missing required redefined "${redefineKey}" property`
					: `Missing required "${propertyKey}" property`,
				'Next props:',
				JSON.stringify(nextProps, null, 4),
			);
		}

		const is = equalFn || (deepEqual && isDeepEqual) || Object.is;
		const key = redefineKey || propertyKey;
		verifiedKeys[key] = true;

		const prevValue = prevProps[key as keyof T];
		const nextValue = nextProps[key as keyof T];

		if (!is(prevValue, nextValue)) {
			if (!rerenderDisabled) {
				isEqual = false;
			}

			instance[propertyKey] = nextValue;
		}
	}

	const nextKeys = Object.keys(nextProps);
	const nextLen = nextKeys.length;

	if (isEqual && nextLen !== expectedLength) {
		const prevLen = Object.keys(prevProps).length;

		if (prevLen !== nextLen) {
			isEqual = false;
		} else {
			for (let i = 0; i < nextLen; i++) {
				if (
					!verifiedKeys[nextKeys[i]] &&
					!Object.is(prevProps[nextKeys[i] as keyof T], nextProps[nextKeys[i] as keyof T])
				) {
					isEqual = false;
					break;
				}
			}
		}
	}

	return isEqual;
};
