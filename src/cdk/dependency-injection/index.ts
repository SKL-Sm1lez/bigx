import '../metadata';

export type { Provider, ProvidersCollection } from './@types/providers.types.ts';
export type { OnDestroy } from './@types/hooks.types.ts';

export { InjectionToken } from './injection-token/injection-token';
export { Injectable } from './decorators/type-decorators.ts';
export { Inject, Optional, Self, SkipSelf } from './decorators/param-decorators.ts';
export { runInContext } from './context/run-in-context';
export { Injector } from './injector/injector.ts';
export { inject } from './context/inject.ts';
