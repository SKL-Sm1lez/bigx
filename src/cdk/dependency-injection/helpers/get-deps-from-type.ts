import type { Provide, ProvidesCollection } from '../@types/inject.types';
import { getInjectableFromProvide } from './get-injectable-from-provide';
import { isInjectable } from './is';
import type { Type } from '@cdk/@types';

const getParamTypes = (type: Type<unknown>): Provide[] => {
	return (Reflect.getOwnMetadata('design:paramtypes', type) as []) || [];
};

export const getDepsFromType = (type: Type<any>): ProvidesCollection => {
	const deps: Provide[] = getParamTypes(type);
	const providesDeps = getInjectableFromProvide(type).deps;

	return deps.map((dep, index) => {
		const validDep: any = isInjectable(dep) ? dep : undefined;

		if (providesDeps[index]) {
			return [validDep, ...(providesDeps[index] as Provide[])];
		}

		return validDep;
	});
};
