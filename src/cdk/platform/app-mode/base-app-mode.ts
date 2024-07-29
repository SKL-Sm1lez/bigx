export abstract class BaseAppMode {
	public abstract readonly isDevMode: boolean;
	public abstract enableDevMode(): void;
	public abstract enableProdMode(): void;
}
