import { Plugin } from 'rollup';
import read from './read';
import { createFilter } from 'rollup-pluginutils';
import getFiles from 'simply-get-files';
import write from 'write';
import nodePath from 'path';
import asyncForEach from './async-for-each';

export type Resolver = (opts: ResolverOptions) => Promise<ResolverResult> | ResolverResult;
export type ResolverResult = {
	code: string;
};
export type ResolverOptions = {
	code: string;
	filesToGlob: {
		name: string;
		path: string;
	}[];
};

export type GlobOptions = {
	file: string;
	include?: string[] | string;
	exclude?: string[] | string;
	importStar?: boolean;
	justImport?: boolean;
};

let watchFiles: string[] = [];

const generateCode = async (options: GlobOptions) => {
	const filter = createFilter(options.include, options.exclude);
	const allFiles = await getFiles(process.cwd());
	const files = allFiles.filter(file => {
		return filter(nodePath.resolve(file)) && file != options.file && file != `rollup.config.js`;
	});
	const filesToGlob = files.map(name => {
		console.log(name);
		const res = nodePath.resolve(name);
		console.log(res);
		return res;
	});

	let imports = ``;
	let body = ``;

	if (!options.justImport) body += `export default [\n`;

	watchFiles = [];

	filesToGlob.forEach((file, index) => {
		watchFiles.push(file);

		if (options.justImport) {
			imports += `import '${file}';\n`;
		} else {
			imports += options.importStar
				? `import * as glob$file${index} from '${file}';\n`
				: `import glob$file${index} from '${file}';\n`;
			body += `	glob$file${index},\n`;
		}
	});

	if (!options.justImport) body += `];`;

	return imports + `\n\n` + body;
};

export default (options: GlobOptions[] | GlobOptions): Plugin => {
	let optionsArr: GlobOptions[] = [];

	if (Array.isArray(options)) optionsArr = options;
	else optionsArr[0] = options;

	optionsArr.map(options => {
		if (!options.include) options.include = `./**`;
		if (!options.exclude) options.exclude = `./**/node_modules/**`;
		return options;
	});

	return {
		name: `glob`,
		resolveId: async function(id) {
			await asyncForEach(optionsArr, async (options: GlobOptions) => {
				if (!options) return this.error(`options must be passed.`);
				if (!options.file) return this.error(`options.file is required.`);

				if (id !== options.file) return null;

				const file = await read(id);

				if (file === null) {
					await write(id, ``);

					this.emitFile({
						id,
						type: `chunk`,
					});
				}
			});

			return null;
		},
		transform: async function(code, id) {
			const options = optionsArr.find(opt => nodePath.resolve(opt.file) === id);
			if (!options) return null;

			code = await generateCode(options);

			watchFiles.forEach(file => this.addWatchFile(file));

			return { code };
		},
		generateBundle: () => {
			watchFiles = [];
		},
	};
};
