import { InjectFlags } from '../@enums/inject-flags.enum';
import type { InjectFlagsDictionary } from '../@types/inject-flags.types';
import { isNumber, isUndefined } from '@cdk/utils';

export const convertToBitFlags = (flags?: InjectFlagsDictionary | InjectFlags): InjectFlags => {
	if (isUndefined(flags)) {
		return InjectFlags.Default;
	}

	if (isNumber(flags)) {
		return flags;
	}

	return (InjectFlags.Default |
		((flags.optional && InjectFlags.Optional) as number) |
		((flags.self && InjectFlags.Self) as number) |
		((flags.skipSelf && InjectFlags.SkipSelf) as number)) as InjectFlags;
};
