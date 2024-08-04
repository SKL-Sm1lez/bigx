import { createContext } from 'react';
import type { BaseInjector } from '../../injector/base-injector';

export const DiContext = createContext<BaseInjector | null>(null);
export const DiProvider = DiContext.Provider;
