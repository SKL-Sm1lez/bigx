import type { TypeProvider } from '../../@types/providers.types';
import { isInjectable } from '../../helpers/is';
import type { ControllerDeclaration, ControllerType } from '../@types/controller.types';
import { isController } from './is';
import { runtimeError } from '@cdk/errors';
import { platform } from '@cdk/platform';
import { stringify } from '@cdk/utils';

export const getControllerMetadata = <T>(contoller: TypeProvider<T>): ControllerDeclaration => {
	if (platform.isDevMode && (!isInjectable(contoller) || !isController(contoller))) {
		throw runtimeError(
			'Injector',
			`This provide -> ${stringify(contoller)}`,
			'is not controller',
			`You must use "@Controller() class ${stringify(contoller)} {}" as the controller for the component`,
		);
	}

	return (contoller as unknown as ControllerType<T>).__controller__;
};
