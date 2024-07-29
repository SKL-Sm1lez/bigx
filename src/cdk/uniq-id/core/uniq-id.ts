import { DEFAULT_ALPABET, DEFAULT_POSTFIX, DEFAULT_PREFIX } from '../constants/uniq-id.const';
import { convertMapToUniqId } from '../helpers/convert-map-to-uniq-id';

export interface UniqIdOptions {
	alphabet: string;
	prefix: string;
	postfix: string;
}

export default class UniqId {
	private readonly alphabet: string;
	private readonly prefix: string;
	private readonly postfix: string;
	private readonly maxDigit: number;

	private digitalMap: number[] = [];

	constructor(options: Partial<UniqIdOptions> = {}) {
		this.alphabet = options.alphabet ?? DEFAULT_ALPABET;
		this.prefix = options.prefix ?? DEFAULT_PREFIX;
		this.postfix = options.postfix ?? DEFAULT_POSTFIX;
		this.maxDigit = this.alphabet.length - 1;
	}

	public getNext(): string {
		const len = this.digitalMap.length;
		let index = 0;

		while (index < len) {
			if (this.digitalMap[index] === this.maxDigit) {
				this.digitalMap[index] = 0;
				index += 1;
				continue;
			}

			this.digitalMap[index] += 1;
			break;
		}

		if (index === len) {
			this.digitalMap.push(0);
		}

		const id = convertMapToUniqId(this.digitalMap, this.alphabet);
		return this.prefix + id + this.postfix;
	}

	public setLastId(str: string): void {
		this.digitalMap = str.split('').map((char) => {
			const position = this.alphabet.indexOf(char);

			if (position < 0) {
				throw new Error(
					'UniqId -> [The transmitted string contains characters that are not in the alphabet used]',
				);
			}

			return position;
		});
	}
}
