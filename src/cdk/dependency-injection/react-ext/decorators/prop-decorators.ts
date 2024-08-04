import type { PropertyDecorateFn } from '../../@types/decorators';
import type { PropsOptions } from '../@types/controller.types';
import { PropDecorator } from './make-decorators';

interface PropertyDecorator {
	(options?: Partial<PropsOptions>): PropertyDecorateFn;
	new (): never;
}

export const Prop = PropDecorator as PropertyDecorator;
