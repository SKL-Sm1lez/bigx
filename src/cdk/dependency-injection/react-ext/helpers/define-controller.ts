import type { ControllerDeclaration } from '../@types/controller.types';

export const defineController = (
	options: Partial<ControllerDeclaration>,
): ControllerDeclaration => ({
	providers: options.providers ?? [],
	properties: options.properties ?? [],
});
