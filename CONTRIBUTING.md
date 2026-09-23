# How To Contribute

## Installation

- `git clone git@github.com:evoactivity/ember-svg-jar.git`
- `cd ember-svg-jar`
- `pnpm install`

This repo uses [pnpm](https://pnpm.io). The pnpm and Node versions are set in `.prototools` for [proto](https://moonrepo.dev/proto). The commands below run from `packages/ember-svg-jar`.

## Running tests

`pnpm test` - Runs all tests including linters.

Run node tests to test any module in `lib` directory:

- `pnpm test:node` - Runs node tests.
- `pnpm test:node --watch` - Runs node tests in "watch mode"

Run ember tests to test anything related to `svg-jar` helper & symbols injection:

- `ember test` – Runs the test suite on the current Ember version
- `ember test --server` – Runs the test suite in "watch mode"
- `ember try:each` – Runs the test suite against multiple Ember versions

## Linting

- `pnpm lint:js`
- `pnpm lint:js:fix`

## Running the dummy application

- `ember serve`
- Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
