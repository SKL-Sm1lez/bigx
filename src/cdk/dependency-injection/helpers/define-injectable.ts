import { InjectFlags } from '../@enums/inject-flags.enum';
import type {
	InjectableDeclaration,
	ProvideIn,
	ProvidesCollection,
	Token,
} from '../@types/inject.types';
import { UniqId } from '@cdk/uniq-id';

const uniqId = new UniqId({ prefix: 'tkn:' });

interface DefineInjectableOptions<T> {
	provideIn: ProvideIn;
	factory: (() => T) | null;
	deps: ProvidesCollection;
	flags: InjectFlags;
	customToken?: Token;
}

export const defineInjectable = <T = unknown>(
	options: Partial<DefineInjectableOptions<T>>,
): InjectableDeclaration<T> => ({
	token: options.customToken ?? (uniqId.getNext() as Token),
	provideIn: options.provideIn ?? null,
	factory: options.factory ?? null,
	deps: options.deps ?? [],
	flags: options.flags ?? InjectFlags.Default,
});
