import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect';

export const useUnmountEffect = (onDestroy: () => void): void => {
	useIsomorphicLayoutEffect(() => () => onDestroy(), []);
};
