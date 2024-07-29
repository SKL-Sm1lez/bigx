import { InjectionToken, Injector } from '..';
import { expect, test, vi } from 'vitest';

test('Injection via injectionToken', () => {
	const FACTORY_VALUE_1 = 1;
	const FACTORY_VALUE_2 = 2;

	const INJ_TOKEN = new InjectionToken<number>('test injection');

	const spyFactory1 = vi.fn().mockImplementation(() => FACTORY_VALUE_1);
	const spyFactory2 = vi.fn().mockImplementation(() => FACTORY_VALUE_2);

	const childInjector = Injector.create({
		providers: [{ provide: INJ_TOKEN, useFactory: spyFactory1 }],
	});

	const deepChildInjector = Injector.create({
		providers: [{ provide: INJ_TOKEN, useFactory: spyFactory2 }],
		parent: childInjector,
	});

	expect(childInjector.get(INJ_TOKEN)).toBe(FACTORY_VALUE_1);
	expect(childInjector.get(INJ_TOKEN)).toBe(FACTORY_VALUE_1);

	expect(deepChildInjector.get(INJ_TOKEN)).toBe(FACTORY_VALUE_2);
	expect(deepChildInjector.get(INJ_TOKEN)).toBe(FACTORY_VALUE_2);

	expect(spyFactory1.mock.calls.length).toBe(1);
	expect(spyFactory2.mock.calls.length).toBe(1);
});
