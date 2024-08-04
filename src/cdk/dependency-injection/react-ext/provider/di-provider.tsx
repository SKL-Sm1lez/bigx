import type { FC } from 'react';
import type { ProvidersCollection } from '../../@types/providers.types';
import { Injector } from '../../injector/injector';
import { DiProvider } from '../context/di-context';
import { useConstant } from '@cdk/hooks';

export interface BigxDiProviderProps {
	providers?: ProvidersCollection;
	children?: React.ReactNode;
}

export const BigxDiProvider: FC<BigxDiProviderProps> = ({ providers = [], children }) => (
	<DiProvider value={useConstant(() => Injector.create({ providers, scopes: ['root'] }))}>
		{children}
	</DiProvider>
);
