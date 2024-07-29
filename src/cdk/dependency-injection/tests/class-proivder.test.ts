import { Inject, Injectable, InjectionToken, Injector, Optional, Self, SkipSelf } from '..';
import { expect, test } from 'vitest';

test('Инъекция "ClassProvider" через "InjectionToken"', () => {
	@Injectable()
	class TestService1 {
		public static readonly uniqName: string = 'test-service-1';

		public readonly name: string = TestService1.uniqName;
	}

	@Injectable()
	class TestService2 implements TestService1 {
		public static readonly uniqName: string = 'test-service-2';

		public readonly name: string = TestService2.uniqName;
	}

	const INJ_TOKEN = new InjectionToken<TestService1>('test injection');

	const rootInjector = Injector.create({
		providers: [{ provide: INJ_TOKEN, useClass: TestService1 }],
	});

	const childInjector = Injector.create({
		providers: [{ provide: INJ_TOKEN, useClass: TestService2 }],
		parent: rootInjector,
	});

	expect(rootInjector.get(INJ_TOKEN).name).toBe(TestService1.uniqName);
	expect(childInjector.get(INJ_TOKEN).name).toBe(TestService2.uniqName);
});

test('Инъекция "ClassProvider" через провайдер содержащий только "provide"', () => {
	@Injectable()
	class TestService1 {
		public static readonly uniqName: string = 'test-service-1';

		public readonly name: string = TestService1.uniqName;
	}

	@Injectable()
	class TestService2 implements TestService1 {
		public static readonly uniqName: string = 'test-service-2';

		public readonly name: string = TestService2.uniqName;
	}

	const rootInjector = Injector.create({
		providers: [{ provide: TestService1 }],
	});

	const childInjector = Injector.create({
		providers: [{ provide: TestService2 }],
		parent: rootInjector,
	});

	expect(rootInjector.get(TestService1).name).toBe(TestService1.uniqName);
	expect(childInjector.get(TestService1).name).toBe(TestService1.uniqName);
	expect(childInjector.get(TestService2).name).toBe(TestService2.uniqName);
});

test('Инъекция "ClassProvider" c поведением "@Inject" через "InjectionToken"', () => {
	@Injectable()
	class TestService1 {
		public static readonly scope: string = 'parent';

		public getScope() {
			return TestService1.scope;
		}
	}

	@Injectable()
	class TestService2 implements TestService1 {
		public static readonly scope: string = 'child';

		public getScope() {
			return TestService2.scope;
		}
	}

	const TOKEN = new InjectionToken<TestService1>('test injection');

	@Injectable()
	class Service {
		constructor(
			@Inject(TOKEN)
			private readonly testService: TestService1,
		) {}

		public checkServiceScope() {
			return this.testService.getScope();
		}
	}

	const rootInjector = Injector.create({
		providers: [{ provide: Service }, { provide: TOKEN, useClass: TestService1 }],
	});

	const childInjector1 = Injector.create({
		providers: [{ provide: Service, useClass: Service }],
		parent: rootInjector,
	});

	const childInjector2 = Injector.create({
		providers: [{ provide: Service }, { provide: TOKEN, useClass: TestService2 }],
		parent: rootInjector,
	});

	expect(rootInjector.get(Service).checkServiceScope()).toBe(TestService1.scope);
	expect(childInjector1.get(Service).checkServiceScope()).toBe(TestService1.scope);
	expect(childInjector2.get(Service).checkServiceScope()).toBe(TestService2.scope);
});

test('Инъекция "ClassProvider" c поведением "@SkipSelf"', () => {
	@Injectable()
	class CounterService {
		private count = 0;

		public increment() {
			this.count++;
		}

		public decrement() {
			this.count--;
		}

		public getCount() {
			return this.count;
		}
	}

	@Injectable()
	class CounterWrapperService {
		constructor(
			@SkipSelf()
			private readonly counterService: CounterService,
		) {}

		public getCount() {
			return this.counterService.getCount();
		}
	}

	const rootInjector = Injector.create({
		providers: [{ provide: CounterService, useClass: CounterService }],
	});

	const childInjector = Injector.create({
		providers: [{ provide: CounterService }, { provide: CounterWrapperService }],
		parent: rootInjector,
	});

	const rootCounter = rootInjector.get(CounterService);
	const childCounter = childInjector.get(CounterService);
	const childCounterWrapper = childInjector.get(CounterWrapperService);

	expect(rootCounter).not.toBe(childCounter);
	expect(rootCounter.getCount()).toBe(0);
	expect(childCounterWrapper.getCount()).toBe(0);

	rootCounter.increment();

	expect(rootCounter.getCount()).toBe(1);
	expect(childCounterWrapper.getCount()).toBe(1);
});

test('Инъекция "ClassProvider" c поведением "@Self"', () => {
	@Injectable()
	class RootService {
		public readonly name = 'root';
	}

	@Injectable()
	class ChildService {
		constructor(
			@Self()
			private readonly rootService: RootService,
		) {}

		public getRootName() {
			return this.rootService.name;
		}
	}

	const rootInjector = Injector.create({
		providers: [{ provide: RootService }],
	});

	const childInjector = Injector.create({
		providers: [{ provide: ChildService }],
		parent: rootInjector,
	});

	expect(rootInjector.get(RootService)).toBeDefined();
	expect(() => childInjector.get(ChildService)).toThrowError();
});

test('Инъекция "ClassProvider" c поведением "@Optional"', () => {
	@Injectable()
	class RootService {}

	@Injectable()
	class ChildService {
		constructor(
			@Optional()
			private readonly rootService?: RootService,
		) {}

		public getRootService(): RootService | undefined {
			return this.rootService;
		}
	}

	const rootInjector = Injector.create({
		providers: [],
	});

	const childInjector = Injector.create({
		providers: [{ provide: ChildService }],
		parent: rootInjector,
	});

	expect(childInjector.get(ChildService).getRootService()).toBeUndefined();
});

test('Инъекция "ClassProvider" c поведением "@Optional" и "@SkipSelf"', () => {
	@Injectable()
	class RootService {}

	@Injectable()
	class ChildService {
		constructor(
			@Optional()
			@SkipSelf()
			private readonly rootService?: RootService,
		) {}

		public getRootService(): RootService | undefined {
			return this.rootService;
		}
	}

	const rootInjector = Injector.create({
		providers: [],
	});

	const childInjector = Injector.create({
		providers: [{ provide: ChildService }, { provide: RootService }],
		parent: rootInjector,
	});

	expect(childInjector.get(ChildService).getRootService()).toBeUndefined();
});

test('Инъекция "ClassProvider" c поведением "@Optional" и "@Self"', () => {
	@Injectable()
	class RootService {}

	@Injectable()
	class ChildService {
		constructor(
			@Optional()
			@Self()
			private readonly rootService?: RootService,
		) {}

		public getRootService(): RootService | undefined {
			return this.rootService;
		}
	}

	const rootInjector = Injector.create({
		providers: [{ provide: RootService }],
	});

	const childInjector = Injector.create({
		providers: [{ provide: ChildService }],
		parent: rootInjector,
	});

	expect(childInjector.get(ChildService).getRootService()).toBeUndefined();
});

test('Инъекция "ClassProvider" c поведением "@Optional" и "@Inject" через "InjectionToken"', () => {
	@Injectable()
	class RootService {}

	const INJ_TOKEN = new InjectionToken<RootService>('test injection');

	@Injectable()
	class ChildService {
		constructor(
			@Optional()
			@Inject(INJ_TOKEN)
			private readonly rootService?: RootService,
		) {}

		public getRootService(): RootService | undefined {
			return this.rootService;
		}
	}

	const rootInjector = Injector.create({
		providers: [],
	});

	const childInjector = Injector.create({
		providers: [{ provide: ChildService }],
		parent: rootInjector,
	});

	expect(childInjector.get(ChildService).getRootService()).toBeUndefined();
});

test('Инъекция "ClassProvider" c поведением "@Optional", "@SkipSelf" и "@Inject" через "InjectionToken"', () => {
	@Injectable()
	class RootService {}

	const INJ_TOKEN = new InjectionToken<RootService>('test injection');

	@Injectable()
	class ChildService {
		constructor(
			@Optional()
			@SkipSelf()
			@Inject(INJ_TOKEN)
			private readonly rootService?: RootService,
		) {}

		public getRootService(): RootService | undefined {
			return this.rootService;
		}
	}

	const rootInjector = Injector.create({
		providers: [],
	});

	const childInjector = Injector.create({
		providers: [{ provide: ChildService }, { provide: INJ_TOKEN, useClass: RootService }],
		parent: rootInjector,
	});

	expect(childInjector.get(ChildService).getRootService()).toBeUndefined();
});

test('Инъекция "ClassProvider" c поведением "@Optional", "@Self" и "@Inject" через "InjectionToken"', () => {
	@Injectable()
	class RootService {}

	const INJ_TOKEN = new InjectionToken<RootService>('test injection');

	@Injectable()
	class ChildService {
		constructor(
			@Optional()
			@Self()
			@Inject(INJ_TOKEN)
			private readonly rootService?: RootService,
		) {}

		public getRootService(): RootService | undefined {
			return this.rootService;
		}
	}

	const rootInjector = Injector.create({
		providers: [{ provide: INJ_TOKEN, useClass: RootService }],
	});

	const childInjector = Injector.create({
		providers: [{ provide: ChildService }],
		parent: rootInjector,
	});

	expect(childInjector.get(ChildService).getRootService()).toBeUndefined();
});

test('Инъекция "ClassProvider" c "multi" флагом', () => {
	const ANIMAL_SAY = 'animal';
	const CAT_SAY = 'cat';
	const DOG_SAY = 'dog';

	@Injectable()
	class Animal {
		public say() {
			return ANIMAL_SAY;
		}
	}

	@Injectable()
	class Cat implements Animal {
		public say() {
			return CAT_SAY;
		}
	}

	@Injectable()
	class Dog implements Animal {
		public say() {
			return DOG_SAY;
		}
	}

	const TOKEN_ANIMAL = new InjectionToken<Animal[]>('animal');

	const rootInjector = Injector.create({
		providers: [{ provide: TOKEN_ANIMAL, useClass: Animal, multi: true }],
	});

	const childInjector = Injector.create({
		providers: [
			{ provide: TOKEN_ANIMAL, useClass: Cat, multi: true },
			{ provide: TOKEN_ANIMAL, useClass: Dog, multi: true },
		],
		parent: rootInjector,
	});

	const rootAniamals = rootInjector.get(TOKEN_ANIMAL);
	const childAniamals = childInjector.get(TOKEN_ANIMAL);

	const say = (animal: Animal) => animal.say();
	const join = (arr: string[]) => arr.join('-');

	expect(rootAniamals.length).toBe(1);
	expect(childAniamals.length).toBe(2);

	expect(join(rootAniamals.map(say))).toBe(ANIMAL_SAY);
	expect(join(childAniamals.map(say))).toBe(join([CAT_SAY, DOG_SAY]));
});
