import { InjectFlags } from '../@enums/inject-flags.enum';
import type { ParamDecorateFn } from '../@types/decorators';
import type { InjectableType, Provide } from '../@types/inject.types';
import { makeParamDecorator } from './make-decorator';

interface InjectDecorator {
	(provide: Provide): ParamDecorateFn;
	new (): InjectableType<any>;
}

export const Inject = makeParamDecorator(InjectFlags.Injectable) as unknown as InjectDecorator;

interface ParamDecorator {
	(): ParamDecorateFn;
	new (): InjectableType<any>;
}

export const Optional = makeParamDecorator(InjectFlags.Optional) as unknown as ParamDecorator;

export const Self = makeParamDecorator(InjectFlags.Self) as unknown as ParamDecorator;

export const SkipSelf = makeParamDecorator(InjectFlags.SkipSelf) as unknown as ParamDecorator;
