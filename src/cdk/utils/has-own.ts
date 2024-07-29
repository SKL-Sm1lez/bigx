import { isObject } from './is';

type DefineProp<T extends {}, P extends string> = T & { [key in P]: unknown };
type RequiredProp<T extends {}, P extends keyof T> = T & Omit<T, P> & Required<Pick<T, P>>;

interface HasOwnProperty {
	<T extends object, P extends keyof T>(obj: T, prop: P): obj is RequiredProp<T, P>;
	<T extends object, P extends string>(obj: T, prop: P): obj is DefineProp<T, P>;
}

export const hasOwn = (<T extends object, P = string>(obj: T, prop: P): obj is T => {
	return isObject(obj) && Object.prototype.hasOwnProperty.call(obj, prop as keyof T);
}) as HasOwnProperty;
