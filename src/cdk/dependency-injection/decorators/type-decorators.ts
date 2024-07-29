import { InjectFlags } from '../@enums/inject-flags.enum';
import { TypeDecorateFn } from '../@types/decorators';
import { InjectableType, ProvideIn } from '../@types/inject.types';
import { makeTypeDecorator } from './make-decorator';

interface InjectableOptions {
	provideIn: ProvideIn;
}
interface TypeDecorator {
	(options?: InjectableOptions): TypeDecorateFn;
	new (): InjectableType<any>;
}

export const Injectable = makeTypeDecorator(InjectFlags.Injectable) as unknown as TypeDecorator;
