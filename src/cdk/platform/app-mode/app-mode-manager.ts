import type { BaseAppMode } from './base-app-mode';

export class AppModeManager implements BaseAppMode {
	private _isDevMode = false;

	public get isDevMode(): boolean {
		return this._isDevMode;
	}

	public enableDevMode(): void {
		this._isDevMode = true;
	}

	public enableProdMode(): void {
		this._isDevMode = false;
	}
}
