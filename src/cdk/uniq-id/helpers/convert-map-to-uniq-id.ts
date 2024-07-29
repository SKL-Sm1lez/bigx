export const convertMapToUniqId = (digitMap: number[], alphabet: string): string => {
	const len: number = digitMap.length;
	let res: string = '';

	for (let i = 0; i < len; i++) {
		res += alphabet[digitMap[i]];
	}

	return res;
};
