import { useState } from 'react';
import { useConstant } from './use-constant';

const createNewObject = (): Record<never, never> => ({});

export const useForceUpdate = (): VoidFunction => {
	const [, update] = useState(createNewObject);

	return useConstant(() => {
		return () => update(createNewObject);
	});
};
