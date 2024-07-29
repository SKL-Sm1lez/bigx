import { Injectable, Injector } from '..';
import { expect, test } from 'vitest';

test('Injecting a "root scope service" into a child injector', () => {
	const ROOT_SERVICE_NAME = 'root-service';

	@Injectable({ provideIn: 'root' })
	class RootService {
		public readonly name = ROOT_SERVICE_NAME;
	}

	@Injectable()
	class ChildService {
		constructor(private readonly rootService: RootService) {}

		public getRootName(): string {
			return this.rootService.name;
		}
	}

	const rootInjector = Injector.create({
		providers: [],
		scopes: ['root'],
	});

	const childInjector = Injector.create({
		providers: [ChildService],
		parent: rootInjector,
	});

	expect(childInjector.get(ChildService).getRootName()).toBe(ROOT_SERVICE_NAME);
});
