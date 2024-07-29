import { InjectFlags } from '../@enums/inject-flags.enum';
import type { InjectFlagsDictionary } from '../@types/inject-flags.types';
import type { Provide, ProvidesCollection } from '../@types/inject.types';
import { getInjectableFromProvide } from '../helpers/get-injectable-from-provide';
import { injectorContext } from './injector-context';
import { runtimeError } from '@cdk/errors';
import { isArray, stringify } from '@cdk/utils';

export const inject = <T>(provide: Provide<T>, flags?: InjectFlags | InjectFlagsDictionary): T => {
	const injector = injectorContext.getContext();

	if (!injector) {
		throw runtimeError(
			'inject',
			'injector context not found',
			'Recommendations:',
			'1) Use the "inject()" only synchronously',
			'2) For safe launch you can use the "runInContext()"',
		);
	}

	return injector.get(provide, flags);
};

export const injectDeps = (provides: ProvidesCollection): unknown[] => {
	const args: any[] = [];

	for (let i = 0; i < provides.length; i++) {
		const provideOrArr = provides[i];

		if (!provideOrArr) {
			args.push(undefined);
			continue;
		}

		if (!isArray(provideOrArr)) {
			args.push(inject(provideOrArr));
			continue;
		}

		if (provideOrArr.length === 0) {
			continue;
		}

		let type: Provide<any> | undefined = undefined;
		let flags: InjectFlags = InjectFlags.Default;

		for (let j = 0; j < provideOrArr.length; j++) {
			const provide = provideOrArr[j];

			if (!provide) {
				continue;
			}

			const flag = getInjectableFromProvide(provide).flags;

			if (flag === InjectFlags.Injectable) {
				type = provide as Provide<any>;
			} else {
				flags |= flag;
			}
		}

		if (!type) {
			throw runtimeError(
				'Injector',
				'deps:',
				stringify(provideOrArr),
				'Must contain the last element "Injectable" provide',
				'it can be "new InjectionToken()" or "@Injectable() class Foo {}"',
			);
		}

		args.push(inject(type, flags));
	}

	return args;
};
