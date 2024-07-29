import autoprefixer from 'autoprefixer';
import path from 'path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

interface ViteConfig {
	mode: string;
	command: string;
}

export default (config: ViteConfig) => {
	const cssScopedName =
		config.mode === 'production' ? '[hash:base64:8]' : '[local]_[hash:base64:4]';

	return defineConfig({
		esbuild: false,
		plugins: [
			swc.vite({
				jsc: {
					parser: {
						syntax: 'typescript',
						tsx: true,
						decorators: true,
					},
					transform: {
						react: {
							runtime: 'automatic',
						},
						legacyDecorator: true,
						decoratorMetadata: true,
					},
				},
				tsconfigFile: './tsconfig.json',
			}),
			svgr({ include: '**/*.svg' }),
		],
		resolve: {
			alias: {
				'@cdk': path.join(__dirname, './src/cdk'),
			},
		},
		build: {
			outDir: './dist',
		},
		server: {
			port: 3000,
		},
		css: {
			modules: {
				localsConvention: 'camelCaseOnly',
				generateScopedName: cssScopedName,
			},
			postcss: {
				plugins: [
					autoprefixer({
						overrideBrowserslist: ['last 2 versions', '> 0.2%', 'not op_mini all'],
					}),
				],
			},
			preprocessorOptions: {
				scss: {
					additionalData: '',
				},
			},
		},
	});
};
