import type { Provide } from './inject.types';
import type { Type } from '@cdk/@types';

interface ProviderFactory<T> extends Function {
	(...args: any[]): T;
}

export interface TypeProvider<T> extends Type<T> {}

interface BaseProvider<T> {
	provide: Provide<T>;
	multi?: boolean;
}

export interface ValueProvider<T = unknown> extends BaseProvider<T> {
	useFactory?: never;
	useExisting?: never;
	useClass?: never;
	useValue: T;
	deps?: never;
}

export interface FactoryProvider<T = unknown> extends BaseProvider<T> {
	useFactory: ProviderFactory<T>;
	useExisting?: never;
	useClass?: never;
	useValue?: never;
	deps?: any[];
}

export interface ClassProvider<T = unknown> extends BaseProvider<T> {
	useFactory?: never;
	useExisting?: never;
	useClass?: Type<T>;
	useValue?: never;
	deps?: never;
}

export interface ExistingProvider<T = unknown> extends BaseProvider<T> {
	useFactory?: never;
	useExisting: Provide<T>;
	useClass?: never;
	useValue?: never;
	deps?: never;
}

export type Provider<T = unknown> =
	| TypeProvider<T>
	| ValueProvider<T>
	| ClassProvider<T>
	| ExistingProvider<T>
	| FactoryProvider<T>;

export type ProvidersCollection = Provider[] | ProvidersCollection[];
