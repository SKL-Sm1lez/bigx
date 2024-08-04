import { Injectable } from '../../decorators/type-decorators';
import type {
	ControllerDeclaration,
	ControllerProps,
	ControllerType,
	PropsOptions,
} from '../@types/controller.types';
import { defineController } from '../helpers/define-controller';
import { isController } from '../helpers/is';
import type { Type } from '@cdk/@types';
import { runtimeError } from '@cdk/errors';
import { isFunction } from '@cdk/utils';

const createInjectableType = Injectable();

const makeIfNeededAndGetController = <T = unknown>(target: Type<T>): ControllerDeclaration => {
	return isController(target)
		? target.__controller__
		: Object.defineProperty(target as unknown as ControllerType<T>, '__controller__', {
				value: defineController({}),
			}).__controller__;
};

export function ContollerDecorator(
	this: unknown | typeof ContollerDecorator,
	options: Partial<ControllerProps> = {},
) {
	if (this instanceof ContollerDecorator) {
		throw runtimeError(
			'@Controller',
			'decorator "Controller" is not supported "new Controller()" syntax',
		);
	}

	return (target: Type<unknown>) => {
		createInjectableType(target);
		const controller = makeIfNeededAndGetController(target);
		controller.providers = options.providers ?? [];
	};
}

export function PropDecorator(
	this: unknown | typeof PropDecorator,
	options: Partial<PropsOptions> = {},
) {
	if (this instanceof PropDecorator) {
		throw runtimeError('@Prop', 'decorator "Prop" is not supported "new Prop()" syntax');
	}

	return (target: any, propertyKey: string) => {
		const controller = makeIfNeededAndGetController(
			isFunction(target.constructor) ? target.constructor : target,
		);

		controller.properties.push({
			propertyKey,
			redefineKey: options.redefineKey ?? null,
			required: !!options.required,
			deepEqual: !!options.deepEqual,
			equalFn: options.equalFn ?? null,
			rerenderDisabled: !!options.rerenderDisabled,
		});
	};
}
