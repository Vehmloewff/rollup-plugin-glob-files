import plugin from '..';
import typescript from 'rollup-plugin-typescript';

export default {
	input: 'globbed.ts',
	output: {
		file: '../dist/test.js',
		format: 'esm',
	},
	plugins: [
		plugin([
			{
				file: `globbed.ts`,
				importStar: true,
				include: [`./fixture/**`],
				exclude: [`./**/*ignore*.ts`, `./**/node_modules/**`],
			},
		]),
		typescript({
			typescript: require('typescript'),
		}),
	],
};
