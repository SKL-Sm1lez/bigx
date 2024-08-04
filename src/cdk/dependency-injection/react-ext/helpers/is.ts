import type { Provide } from '../../@types/inject.types';
import type { ControllerProvide } from '../@types/controller.types';
import { hasOwn } from '@cdk/utils';

export const isController = <T>(provide: Provide<T>): provide is ControllerProvide<T> => {
	return hasOwn(provide, '__controller__');
};
