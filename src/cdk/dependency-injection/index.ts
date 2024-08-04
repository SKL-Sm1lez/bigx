import '../metadata';

export type { Provider, ProvidersCollection } from './@types/providers.types';
export type { OnDestroy } from './@types/hooks.types';

export { InjectionToken } from './injection-token/injection-token';
export { Injectable } from './decorators/type-decorators';
export { Inject, Optional, Self, SkipSelf } from './decorators/param-decorators';
export { runInContext } from './context/run-in-context';
export { Injector } from './injector/injector';
export { inject } from './context/inject';

// React ext
export { useInject } from './react-ext/hooks/use-inject';
export { connect } from './react-ext/connect/connect';
export { ScopedProviders } from './react-ext/component/scoped-providers';
export { Controller } from './react-ext/decorators/type-decorators';
export { Prop } from './react-ext/decorators/prop-decorators';
export type { OnInit } from './react-ext/@types/hooks.types';
