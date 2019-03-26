## Development setup

### Installation

* `git clone <repository-url>` this repository
* `cd ember-svg-jar`
* `npm install`

### Building

* `npm run build`

### Running tests and linting

Run all tests and lint code (`npm run lint && npm run nodetest && ember test`):

```shell
npm test
```

Test node modules (`src` directory):

```shell
npm run nodetest
```

Test Ember related code:

* `ember test`
* `ember test --server`
* `ember try:each`

Lint all code (`src`, `addon`, `app`, `node-tests`, `tests` directories)

```shell
npm run lint
```

### Running the dummy app

* `ember serve`
* Visit the app at [http://localhost:4200](http://localhost:4200)

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).


