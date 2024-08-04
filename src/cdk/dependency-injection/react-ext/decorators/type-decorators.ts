import type { TypeDecorateFn } from '../../@types/decorators';
import type { ControllerProps } from '../@types/controller.types';
import { ContollerDecorator } from './make-decorators';

interface ControllerDecorator {
	(options: Partial<ControllerProps>): TypeDecorateFn;
	new (): never;
}

export const Controller = ContollerDecorator as ControllerDecorator;
