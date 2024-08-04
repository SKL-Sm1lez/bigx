import { getTag } from './@internal/get-tag';
import { root } from './@internal/root';

////////////////////////////////////////////////////////////////////
// #region isArray
////////////////////////////////////////////////////////////////////

/**
 *
 * Checks if a value is an array.
 *
 * @param value The value to check.
 * @returns True if the value is an array, false otherwise.
 */
export const isArray = Array.isArray;

// #endregion

////////////////////////////////////////////////////////////////////
// #region isNaN
////////////////////////////////////////////////////////////////////

/**
 * Checks if a value is NaN.
 *
 * @param value The value to check.
 * @returns True if the value is NaN, false otherwise.
 */
export const isNaN = Number.isNaN as (value: unknown) => value is number;

// #endregion

////////////////////////////////////////////////////////////////////
// #region isObject
////////////////////////////////////////////////////////////////////

/**
 * Checks if a value is an object.
 *
 * @param value The value to check.
 * @returns True if the value is an object, false otherwise.
 */
export const isObject = (value: unknown): value is object => {
	const type = typeof value;
	return type === 'object' ? value !== null : type === 'function';
};

// #endregion

////////////////////////////////////////////////////////////////////
// #region isObjectLike
////////////////////////////////////////////////////////////////////

/**
 * Checks if a value is an object-like (i.e., non-null and of type 'object').
 *
 * @param value The value to check.
 * @returns True if the value is object-like, false otherwise.
 */
export const isObjectLike = (value: unknown): value is object => {
	return typeof value === 'object' && value !== null;
};

// #endregion

////////////////////////////////////////////////////////////////////
// #region isPresent
////////////////////////////////////////////////////////////////////

/**
 * Checks if a value is present (i.e., not null or undefined).
 *
 * @param value The value to check.
 * @returns True if the value is present, false otherwise.
 */
export const isPresent = <T>(value?: T | null): value is T => {
	return value !== null && value !== undefined;
};

// #endregion

////////////////////////////////////////////////////////////////////
// #region isBigint
////////////////////////////////////////////////////////////////////

/**
 * Checks if a value is a bigint.
 *
 * @param value The value to check.
 * @returns True if the value is a bigint, false otherwise.
 */
export const isBigint = (value: unknown): value is bigint => {
	return (
		typeof value === 'bigint' || (isObjectLike(value) && getTag(value) === '[object BigInt]')
	);
};

// #endregion

////////////////////////////////////////////////////////////////////
// #region isBoolean
////////////////////////////////////////////////////////////////////

/**
 * Checks if a value is a boolean.
 *
 * @param value The value to check.
 * @returns True if the value is a boolean, false otherwise.
 */
export const isBoolean = (value: unknown): value is boolean => {
	return (
		value === true ||
		value === false ||
		(isObjectLike(value) && getTag(value) === '[object Boolean]')
	);
};

// #endregion

////////////////////////////////////////////////////////////////////
// #region isFunction
////////////////////////////////////////////////////////////////////

/**
 * Checks if a value is a function.
 *
 * @param value The value to check.
 * @returns True if the value is a function, false otherwise.
 */
export const isFunction = (value: unknown): value is Function => {
	return typeof value === 'function';
};

// #endregion

////////////////////////////////////////////////////////////////////
// #region isNumber
////////////////////////////////////////////////////////////////////

/**
 * Checks if a value is a number.
 *
 * @param value The value to check.
 * @returns True if the value is a number, false otherwise.
 */
export const isNumber = (value: unknown): value is number => {
	return (
		typeof value === 'number' || (isObjectLike(value) && getTag(value) === '[object Number]')
	);
};

// #endregion

////////////////////////////////////////////////////////////////////
// #region isString
////////////////////////////////////////////////////////////////////

/**
 * Checks if a value is a string.
 *
 * @param value The value to check.
 * @returns True if the value is a string, false otherwise.
 */
export const isString = (value: unknown): value is string => {
	return (
		typeof value === 'string' ||
		(isObjectLike(value) && !isArray(value) && getTag(value) === '[object String]')
	);
};

// #endregion

////////////////////////////////////////////////////////////////////
// #region isSymbol
////////////////////////////////////////////////////////////////////

/**
 * Checks if a value is a symbol.
 *
 * @param value The value to check.
 * @returns True if the value is a symbol, false otherwise.
 */
export const isSymbol = (value: unknown): value is symbol => {
	return (
		typeof value === 'symbol' || (isObjectLike(value) && getTag(value) === '[object Symbol]')
	);
};

// #endregion

////////////////////////////////////////////////////////////////////
// #region isNull
////////////////////////////////////////////////////////////////////

/**
 * Checks if a value is null.
 *
 * @param value The value to check.
 * @returns True if the value is null, false otherwise.
 */
export const isNull = (value: unknown): value is null => {
	return value === null;
};

// #endregion

////////////////////////////////////////////////////////////////////
// #region isUndefined
////////////////////////////////////////////////////////////////////

/**
 * Checks if a value is undefined.
 *
 * @param value The value to check.
 * @returns True if the value is undefined, false otherwise.
 */
export const isUndefined = (value: unknown): value is undefined => {
	return value === undefined;
};

// #endregion

////////////////////////////////////////////////////////////////////
// #region isBuffer
////////////////////////////////////////////////////////////////////

const nativeIsBuffer = root?.Buffer?.isBuffer;

/**
 * Checks if a value is a buffer.
 *
 * @param value - The value to check.
 * @returns True if the value is a buffer, false otherwise.
 *
 * @description
 * This function uses the `Buffer` constructor to check if a value is a buffer.
 * If the `Buffer` constructor is not available in the current environment,
 * the function always returns false.
 */
export const isBuffer =
	typeof nativeIsBuffer === 'function'
		? (value: unknown): value is Buffer => nativeIsBuffer(value)
		: () => false;

// #endregion

////////////////////////////////////////////////////////////////////
// #region isTypedArray
////////////////////////////////////////////////////////////////////

const reTypedTag = /^\[object (?:Float(?:32|64)|(?:Int|Uint)(?:8|16|32)|Uint8Clamped)Array\]$/;

/**
 * Checks if a value is a typed array.
 *
 * @param value - The value to check.
 * @returns True if the value is a typed array, false otherwise.
 */
export const isTypedArray = (value: unknown): boolean => {
	return isObjectLike(value) && reTypedTag.test(getTag(value));
};

// #endregion
