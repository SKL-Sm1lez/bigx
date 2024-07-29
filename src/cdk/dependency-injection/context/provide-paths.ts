import { Provide } from '../@types/inject.types';
import { stringify } from '@cdk/utils';

class ProvidesPath {
	private readonly provideQueue: Provide[] = [];

	public get hasProvideQueue(): boolean {
		return this.provideQueue.length > 0;
	}

	public getCircularPath(provide: Provide): string {
		const startIndex = this.indexOfAll(this.provideQueue, provide);

		if (!startIndex.length || startIndex.length === 1) {
			return stringify(provide);
		}

		const queue = this.provideQueue
			.slice(startIndex[startIndex.length - 2], startIndex[startIndex.length - 1] + 1)
			.map(stringify);

		queue[0] = `[${queue[0]}]`;
		queue[queue.length - 1] = `[${queue[queue.length - 1]}]`;

		return queue.join(' > ');
	}

	public addProvide(provide: Provide): void {
		this.provideQueue.push(provide);
	}

	public clear(): void {
		this.provideQueue.length = 0;
	}

	private indexOfAll(arr: unknown[], val: unknown) {
		const indexes = [];

		for (let i = 0; i < arr.length; i++) {
			if (arr[i] === val) indexes.push(i);
		}

		return indexes;
	}
}

export const providesPath = new ProvidesPath();
