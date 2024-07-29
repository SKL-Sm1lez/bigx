export const canUseDom = (): boolean => {
	return !!(
		typeof window !== 'undefined' &&
		typeof window.document &&
		typeof window.document.createElement
	);
};
