import type { FC } from 'react';
import { DiProvider } from '../context/di-context';
import { useInjector } from '../hooks/use-injector';
import type { ProvidersCollection } from '@cdk/dependency-injection/@types/providers.types';
import { Injector } from '@cdk/dependency-injection/injector/injector';
import { useConstant, useUnmountEffect } from '@cdk/hooks';

export interface ScopedProvidersProps {
	providers?: ProvidersCollection;
	children?: React.ReactNode;
}

export const ScopedProviders: FC<ScopedProvidersProps> = ({ providers = [], children }) => {
	const parentInjector = useInjector();

	const injector = useConstant(() =>
		Injector.create({
			providers,
			parent: parentInjector,
		}),
	);

	useUnmountEffect(() => {
		injector.destroy();
	});

	return <DiProvider value={injector}>{children}</DiProvider>;
};
