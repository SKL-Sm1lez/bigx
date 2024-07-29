import type { InjectionToken } from '../injection-token/injection-token';
import type { Type } from '@cdk/@types';

export type Token = string & { _opaque: 'token' };
export type Provide<T = unknown> = InjectionToken<T> | Type<T>;
export type ProvideIn<T extends string | null = null> = 'root' | T;

export interface InjectableDeclaration<T> {
	provideIn: ProvideIn;
	token: Token;
	factory: (() => T) | null;
	deps: ProvidesCollection;
	flags: number;
}

export interface InjectableType<T> {
	__injectable__: InjectableDeclaration<T>;
}

export type InjectableProvide<T = unknown> = Provide<T> & InjectableType<T>;
export type ProvidesCollection = Array<Provide | [...InjectableProvide[], Provide]>;
