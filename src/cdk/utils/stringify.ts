import { isArray, isBigint, isFunction, isNumber, isPresent, isString, isSymbol } from './is';

export const stringify = (value: unknown): string => {
	if (
		isString(value) ||
		isNumber(value) ||
		isBigint(value) ||
		!isPresent(value) ||
		isSymbol(value)
	) {
		return String(value);
	}

	if (isArray(value)) {
		return '[' + value.map(stringify).join(', ') + ']';
	}

	if (isFunction(value)) {
		if (!isPresent(value.name) || (isString(value.name) && !value.name.trim())) {
			return 'anonymous()';
		}
		if (isString(value.name)) {
			return value.name;
		}
		return stringify(value.name);
	}

	const string = (value as any).toString();

	if (!isPresent(string)) {
		return stringify(value);
	}

	const newLineIndex = string.indexOf('\n');
	return newLineIndex === -1 ? string : string.substring(0, newLineIndex);
};
