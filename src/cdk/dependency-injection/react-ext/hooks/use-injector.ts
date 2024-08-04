import { useContext } from 'react';
import type { BaseInjector } from '../../injector/base-injector';
import { DiContext } from '../context/di-context';
import { runtimeError } from '@cdk/errors';

export const useInjector = (): BaseInjector => {
	const injector = useContext(DiContext);

	if (!injector) {
		throw runtimeError('useInjector', 'This hook must be used within a BigxProviders');
	}

	return injector;
};
