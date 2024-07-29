import { InjectFlags } from '../@enums/inject-flags.enum';
import type {
	InjectableDeclaration,
	InjectableType,
	Provide,
	ProvideIn,
} from '../@types/inject.types';
import { DECORATOR_TOKEN } from '../constants/token.const';
import { defineInjectable } from '../helpers/define-injectable';
import { isInjectable } from '../helpers/is';
import type { Type } from '@cdk/@types';
import { isArray } from '@cdk/utils';

const makeIfNeededAndGetInjectable = <T = unknown>(target: Type<T>): InjectableDeclaration<T> => {
	return isInjectable(target)
		? target.__injectable__
		: Object.defineProperty(target as unknown as InjectableType<T>, '__injectable__', {
				value: defineInjectable({}),
			}).__injectable__;
};

export const makeTypeDecorator = (flags: InjectFlags) => {
	function TypeDecoratorFactory(
		this: unknown | typeof TypeDecoratorFactory,
		options?: Record<any, unknown>,
	) {
		if (this instanceof TypeDecoratorFactory) {
			(this as unknown as InjectableType<any>).__injectable__ = defineInjectable({
				flags,
				customToken: DECORATOR_TOKEN,
			});

			return this;
		}

		return (target: Type<any>) => {
			const injectable = makeIfNeededAndGetInjectable(target);

			injectable.provideIn = (options?.provideIn ?? null) as ProvideIn;
			injectable.flags |= flags;
		};
	}

	return TypeDecoratorFactory;
};

export const makeParamDecorator = (flags: InjectFlags) => {
	function ParamDecoratorFactory(
		this: unknown | typeof ParamDecoratorFactory,
		provide?: Provide,
	) {
		if (this instanceof ParamDecoratorFactory) {
			(this as unknown as InjectableType<any>).__injectable__ = defineInjectable({
				flags,
				customToken: DECORATOR_TOKEN,
			});

			return this;
		}

		return (target: Type<any>, _propertyKey: string, parameterIndex: number) => {
			const injectable = makeIfNeededAndGetInjectable(target);

			if (!injectable.deps.length) {
				injectable.deps = Array.from({ length: target.length });
			}

			if (flags === InjectFlags.Injectable) {
				if (!provide) return;

				if (isArray(injectable.deps[parameterIndex])) {
					(injectable.deps[parameterIndex] as any[]).push(provide);
				} else {
					injectable.deps[parameterIndex] = [provide];
				}
			} else {
				const __defined__ = {
					__injectable__: defineInjectable({ flags, customToken: DECORATOR_TOKEN }),
				};

				if (isArray(injectable.deps[parameterIndex])) {
					(injectable.deps[parameterIndex] as any[]).push(__defined__);
				} else {
					injectable.deps[parameterIndex] = [__defined__ as any];
				}
			}
		};
	}

	return ParamDecoratorFactory;
};
