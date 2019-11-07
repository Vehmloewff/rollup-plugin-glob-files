import plugin from '..';
import typescript from 'rollup-plugin-typescript';

export default {
	input: 'globbed.ts',
	output: {
		file: '../dist/test.js',
		format: 'esm',
	},
	plugins: [
		plugin({
			file: `globbed.ts`,
		}),
		typescript({
			typescript: require('typescript'),
		}),
	],
};
