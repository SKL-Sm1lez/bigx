import type { FC } from 'react';
import {
	BigxDiProvider,
	type BigxDiProviderProps,
} from '../dependency-injection/react-ext/provider/di-provider';
import { useConstant } from '@cdk/hooks';
import { platform } from '@cdk/platform';

interface BigxProviderProps extends BigxDiProviderProps {
	isDevMode?: boolean;
}

export const BigxProviders: FC<BigxProviderProps> = ({
	providers,
	isDevMode = false,
	children,
}) => {
	useConstant(() => {
		platform.enableDevMode(isDevMode);
	});

	return <BigxDiProvider providers={providers}>{children}</BigxDiProvider>;
};
