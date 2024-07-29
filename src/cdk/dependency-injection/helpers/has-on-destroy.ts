import { OnDestroy } from '../@types/hooks.types';
import { isFunction, isObjectLike } from '@cdk/utils';

export const hasOnDestroy = (value: unknown): value is OnDestroy => {
	return isObjectLike(value) && isFunction((value as unknown as OnDestroy).onDestroy);
};
