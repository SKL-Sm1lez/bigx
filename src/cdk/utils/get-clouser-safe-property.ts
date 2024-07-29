export const getClosureSafeProperty = <T extends {} = {}>(objWithPropertyToExtract: T): string => {
	for (let key in objWithPropertyToExtract) {
		if (objWithPropertyToExtract[key] === getClosureSafeProperty) {
			return key;
		}
	}

	throw new Error('Could not find renamed property on target object.');
};
