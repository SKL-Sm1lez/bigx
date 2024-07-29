import type { BaseInjector } from '../injector/base-injector';

class InjectorContext {
	private currentContext: BaseInjector | null = null;

	public setContext(injector: BaseInjector | null): BaseInjector | null {
		const prevContext = this.currentContext;
		this.currentContext = injector;
		return prevContext;
	}

	public getContext(): BaseInjector | null {
		return this.currentContext;
	}
}

export const injectorContext = new InjectorContext();
