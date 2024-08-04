import type { OnInit } from '../@types/hooks.types';
import { isFunction } from '@cdk/utils';

export const hasOnInit = (value: unknown): value is OnInit => {
	return isFunction((value as unknown as OnInit).onInit);
};
