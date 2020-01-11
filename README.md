# rollup-plugin-glob-files

Import files matching a glob pattern and export them as an array.

This plugin works similar to webpack's `require.context` or `require.ensure`, but for rollup.

## Usage

```sh
npm i rollup-plugin-glob-files -D
```

```js
// rollup.plugin.js
import globFiles from 'rollup-plugin-glob-files';

export default {
	// ...
	plugins: [globFiles(options)],
};
```

### options: GlobOptions

-   `GlobOptions` is an object which contains the following. All of the paramaters are optional except for `file`.

    -   `key`: _(required)_: This can be anything. Just remember to import by this key. If, for example, this was set to `@awesome`, you would:

        ```ts
        import someArray from '@awesome';
        ```

    -   `include`: This can be a single [minimatch glob pattern](https://github.com/isaacs/minimatch#minimatch), or an array of them. Default is `./**`.

    -   `exclude`: Same as `include`, except, of course, it excludes the files. Default is `./**/node_modules/**`

    -   `importStar`: Whether to use `import * as something from 'other'` in place of `import something from 'other'`. Default is `false`.

    -   `justImport`: If the files should just be imported. Instead of `import something from 'other'`, it just does this: `import 'other'`.

## License

[MIT](/LICENSE)
