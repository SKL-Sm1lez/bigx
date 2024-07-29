export const RUNTIME_ERROR = 'RuntimeError';

const runtimeError = (emitterName: string, ...errorMessage: string[]): Error => {
	const error = new Error(`[${RUNTIME_ERROR} > ${emitterName}]\n${errorMessage.join('\n')}`);
	error.name = RUNTIME_ERROR;
	return error;
};

runtimeError.__type__ = RUNTIME_ERROR;

export { runtimeError };
