export type Tags =
	| '[object Undefined]'
	| '[object Null]'
	| '[object Boolean]'
	| '[object Number]'
	| '[object String]'
	| '[object Symbol]'
	| '[object Function]'
	| '[object Object]'
	| '[object BigInt]'
	| '[object Arguments]'
	| '[object Date]'
	| '[object Error]'
	| '[object Map]'
	| '[object RegExp]'
	| '[object Set]'
	| '[object ArrayBuffer]'
	| '[object DataView]';

const toString = Object.prototype.toString;

export const getTag = (value: unknown): Tags => {
	if (value === undefined) {
		return '[object Undefined]';
	}

	if (value === null) {
		return '[object Null]';
	}

	return toString.call(value) as Tags;
};
