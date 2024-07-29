import { InjectionToken, Injector } from '..';
import { expect, test } from 'vitest';

test('Injection via injectionToken', () => {
	const SERVICE_NAME_1 = 'test-service-1';
	const SERVICE_NAME_2 = 'test-service-2';

	const INJ_TOKEN = new InjectionToken<string>('test injection');

	const childInjector = Injector.create({
		providers: [{ provide: INJ_TOKEN, useValue: SERVICE_NAME_1 }],
	});

	const deepChildInjector = Injector.create({
		providers: [{ provide: INJ_TOKEN, useValue: SERVICE_NAME_2 }],
		parent: childInjector,
	});

	expect(childInjector.get(INJ_TOKEN)).toBe(SERVICE_NAME_1);
	expect(deepChildInjector.get(INJ_TOKEN)).toBe(SERVICE_NAME_2);
});
