import { Injectable, InjectionToken, Injector } from '..';
import { expect, test } from 'vitest';

test('Injection via injectionToken', () => {
	const SERVICE_NAME = 'test-service';

	@Injectable()
	class TestService1 {
		public readonly name: string = SERVICE_NAME;
	}

	const INJ_TOKEN = new InjectionToken<TestService1>('test injection');

	const childInjector = Injector.create({
		providers: [TestService1],
	});

	const deepChildInjector = Injector.create({
		providers: [{ provide: INJ_TOKEN, useExisting: TestService1 }],
		parent: childInjector,
	});

	expect(childInjector.get(TestService1).name).toBe(SERVICE_NAME);
	expect(deepChildInjector.get(INJ_TOKEN).name).toBe(SERVICE_NAME);
});
