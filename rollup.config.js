import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';
import command from 'rollup-plugin-command';
import typescript from 'rollup-plugin-typescript';

const name = 'rollupPluginGlob';
const sourcemap = true;
const prod = process.env.NODE_ENV === 'production';
const watching = process.env.ROLLUP_WATCH;

const sharedOutputOptions = {
	name,
	sourcemap,
	exports: 'named',
};

const output = [{ file: pkg.main, format: 'cjs', ...sharedOutputOptions }];

if (prod) output.push({ file: pkg.module, format: 'es', ...sharedOutputOptions });

export default {
	input: 'src/index.ts',
	output,
	external: ['fs', 'path', 'util'],
	plugins: [
		resolve({
			preferBuiltins: true,
		}),
		commonjs(),
		!prod && command(`cd test && rollup -c`, { exitOnFail: !watching }),
		typescript({
			typescript: require('typescript'),
		}),
	],
};
