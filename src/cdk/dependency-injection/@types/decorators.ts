import type { Type } from '@cdk/@types';

export interface ParamDecorateFn {
	(type: Type<any>, _key?: string, index?: number): void;
}

export interface TypeDecorateFn {
	(type: Type<any>): void;
}
