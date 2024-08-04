import { AppModeManager, type BaseAppMode } from './app-mode';
import { type BaseEnvironment, EnvironmentManager } from './environment';

interface PlatformOptions {
	appMode: BaseAppMode;
	environment: BaseEnvironment;
}

class Platform {
	private readonly appMode: BaseAppMode;
	private readonly environment: BaseEnvironment;

	constructor(options: PlatformOptions) {
		this.appMode = options.appMode;
		this.environment = options.environment;
	}

	// App Mode
	public get isDevMode(): boolean {
		return this.appMode.isDevMode;
	}
	public enableDevMode(isDevMode: boolean = true): void {
		isDevMode ? this.appMode.enableDevMode() : this.appMode.enableProdMode();
	}

	// Environment
	public get isBrowser(): boolean {
		return this.environment.isBrowser;
	}
}

export const platform = new Platform({
	appMode: new AppModeManager(),
	environment: new EnvironmentManager(),
});
