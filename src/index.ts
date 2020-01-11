import { Plugin } from 'rollup';
import { createFilter } from 'rollup-pluginutils';
import getFiles from 'simply-get-files';
import nodePath from 'path';
import random from './random';

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
	key: string;
	include?: string[] | string;
	exclude?: string[] | string;
	importStar?: boolean;
	justImport?: boolean;
};

const generateCode = async (options: GlobOptions) => {
	const filter = createFilter(options.include, options.exclude);
	const allFiles = await getFiles(process.cwd());
	const files = allFiles.filter(file => {
		return filter(nodePath.resolve(file)) && file != options.key && file != `rollup.config.js`;
	});
	const filesToGlob = files.map(name => nodePath.resolve(name).replace(/\\/g, '/'));

	let imports = ``;
	let body = ``;

	if (!options.justImport) body += `export default [\n`;

	filesToGlob.forEach((file, index) => {
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

export default (options: GlobOptions): Plugin => {
	let id = `globfile?${random(10)}`;

	if (!options.include) options.include = `./**`;
	if (!options.exclude) options.exclude = `./**/node_modules/**`;

	return {
		name: `glob`,
		resolveId: async function(source) {
			if (!options) return this.error(`options must be passed.`);
			if (!options.key) return this.error(`options.key is required.`);

			if (source === options.key) return id;

			return null;
		},
		load: async path => {
			if (path !== id) return null;

			const code = await generateCode(options);

			console.log(code, path);

			return { code };
		},
	};
};
