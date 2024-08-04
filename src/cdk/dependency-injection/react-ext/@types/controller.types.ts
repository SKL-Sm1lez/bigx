import type { InjectableType, Provide } from '../../@types/inject.types';
import type { ProvidersCollection } from '../../@types/providers.types';

export interface PropsOptions {
	redefineKey: string | null;
	required: boolean;
	deepEqual: boolean;
	equalFn: ((a: unknown, b: unknown) => boolean) | null;
	rerenderDisabled: boolean;
}

export interface ControllerPropsOptions extends PropsOptions {
	propertyKey: string;
}

export interface ControllerDeclaration {
	providers: ProvidersCollection;
	properties: ControllerPropsOptions[];
}

export interface ControllerType<T> extends InjectableType<T> {
	__controller__: ControllerDeclaration;
}

export type ControllerProvide<T> = ControllerType<T> & Provide<T>;

export interface ControllerProps {
	providers?: ProvidersCollection;
}
