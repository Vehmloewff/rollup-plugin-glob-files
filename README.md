# nodejs-template

## Startup

```sh
npx degit Vehmloewff/nodejs-template#typescript nodejs-app
# or the javascript branch
cd nodejs-app
npm i
```

## Running the tests

To run `test.js`:

```sh
npm test
# or
npm test -- -w
```

## Linting

This template uses a combination of `prettier` and `eslint`.

```sh
npm run lint
# or
npm run lint:test
```

If you need `eslint` or `prettier` to ignore a file, just add it to the `.eslintignore` or `.prettierignore`.

## License

[MIT](/LICENSE)
