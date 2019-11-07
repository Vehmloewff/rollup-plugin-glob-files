import { Plugin } from 'rollup';
import read from './read';
import { createFilter } from 'rollup-pluginutils';
import getFiles from 'simply-get-files';
import write from 'write';
import nodePath from 'path';

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
	include?: string[];
	exclude?: string[];
	resolve?: Resolver | 'import' | 'import-default-call' | 'import-default-call-async';
};

export default (options: GlobOptions): Plugin => ({
	name: `glob`,
	resolveId: async function(id) {
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

		return null;
	},
	transform: async function(code, id) {
		if (id !== nodePath.resolve(options.file)) return null;

		if (typeof options.resolve === 'string') {
			if (options.resolve === 'import') options.resolve = importResolver;
			else if (options.resolve === 'import-default-call') options.resolve = importDefaultCallResolver;
			else if (options.resolve === 'import-default-call-async') options.resolve = importDefaultCallAsyncResolver;
			else return this.error(`Invalid string passed to 'options.resolve'`);
		}

		const filter = createFilter(options.include || [], options.exclude || []);
		const allFiles = await getFiles(process.cwd());
		const files = allFiles.filter(file => {
			return filter(nodePath.resolve(file)) && file != options.file && file != `rollup.config.js`;
		});
		const filesToGlob = files.map(name => ({ name, path: `./${name}` }));

		const resolver = () => {
			if (!options.resolve) return importResolver;
			if (typeof options.resolve === 'function') return options.resolve;
			if (options.resolve === 'import') return importResolver;
			if (options.resolve === 'import-default-call') return importDefaultCallResolver;
			if (options.resolve === 'import-default-call-async') return importDefaultCallAsyncResolver;
			this.error(`Invalid string passed to 'options.resolve'`);
		};

		const result = await resolver()({
			code,
			filesToGlob,
		});

		return { code: result.code };
	},
});

export const importResolver: Resolver = ({ code, filesToGlob }) => {
	filesToGlob.forEach(file => {
		code += `import "${file.path}";`;
	});

	return { code };
};

export const importDefaultCallResolver: Resolver = ({ code, filesToGlob }) => {
	filesToGlob.forEach((file, index) => {
		const fileName = `_file${index}`;

		code += `import ${fileName} from "${file.path}";\n${fileName}();\n`;
	});
	return { code };
};

export const importDefaultCallAsyncResolver: Resolver = ({ code, filesToGlob }) => {
	code += `(async function(){`;

	filesToGlob.forEach((file, index) => {
		const fileName = `_file${index}`;

		code += `	import ${fileName} from "${file.path}";\nawait ${fileName}();\n`;
	});

	code += `}());`;

	return { code };
};
