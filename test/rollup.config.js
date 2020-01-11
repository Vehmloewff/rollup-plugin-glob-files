import plugin from '..';
import typescript from 'rollup-plugin-typescript';

export default {
	input: '@awesome',
	output: {
		file: '../dist/test.js',
		format: 'esm',
	},
	plugins: [
		plugin({
			key: `@awesome`,
			importStar: true,
			include: [`./fixture/**`],
			exclude: [`./**/*ignore*.ts`, `./**/node_modules/**`],
		}),
		typescript({
			typescript: require('typescript'),
		}),
	],
};
