import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';
import typescript from 'rollup-plugin-typescript';

const name = 'rollupPluginGlob';
const sourcemap = true;
const sharedOutputOptions = {
	name,
	sourcemap,
	exports: 'named',
};

const output = [
	{ file: pkg.main, format: 'cjs', ...sharedOutputOptions },
	{ file: pkg.module, format: 'es', ...sharedOutputOptions },
];

export default {
	input: 'src/index.ts',
	output,
	external: ['fs', 'path', 'util'],
	plugins: [
		resolve({
			preferBuiltins: true,
		}),
		commonjs(),
		typescript({
			typescript: require('typescript'),
		}),
	],
};
