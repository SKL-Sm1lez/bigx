import { type FC, memo } from 'react';
import type { ProvidersCollection, TypeProvider } from '../../@types/providers.types';
import { Injector } from '../../injector/injector';
import { DiProvider } from '../context/di-context';
import { applyProps } from '../helpers/apply-props';
import { getControllerMetadata } from '../helpers/get-controller-metadata';
import { hasOnInit } from '../helpers/has-on-init';
import { patchProps } from '../helpers/patch-props';
import { useInjector } from '../hooks/use-injector';
import { useConstant, useUnmountEffect } from '@cdk/hooks';

export interface ConnectProps<T extends {}> {
	controller?: TypeProvider<unknown>;
	cmp: FC<T>;
}

export const connect = <T extends {}>(controller: TypeProvider<unknown>, cmp: FC<T>): FC<T> => {
	return (props: T) => {
		const parentInjector = useInjector();

		const { injector, MemoizedComponent } = useConstant(() => {
			const metadata = getControllerMetadata(controller);

			const injector = Injector.create({
				providers: [controller, ...metadata.providers] as ProvidersCollection,
				parent: parentInjector,
			});

			const controllerInstance = injector.get(controller);

			applyProps({
				controller,
				expectedProperties: metadata.properties,
				instance: controllerInstance as Record<string, unknown>,
				initialProps: props,
			});

			if (hasOnInit(controllerInstance)) {
				controllerInstance.onInit();
			}

			return {
				injector,
				instance: controllerInstance,
				MemoizedComponent: memo(cmp, (prevProps, nextProps) => {
					return patchProps({
						controller,
						expectedProperties: metadata.properties,
						instance: controllerInstance as Record<string, unknown>,
						prevProps,
						nextProps,
					});
				}),
			};
		});

		useUnmountEffect(() => {
			injector.destroy();
		});

		return (
			<DiProvider value={injector}>
				<MemoizedComponent {...props} />
			</DiProvider>
		);
	};
};
