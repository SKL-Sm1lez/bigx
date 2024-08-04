import { useRef } from 'react';

const NOT_DEFINED = Symbol('not-defined');

export const useConstant = <T>(initializer: () => T): T => {
	const ref = useRef<T | Symbol>(NOT_DEFINED);

	if (ref.current === NOT_DEFINED) {
		ref.current = initializer();
	}

	return ref.current as T;
};
