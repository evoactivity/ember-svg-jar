# broccoli-svg-optimizer

[![Build Status](https://travis-ci.org/ivanvotti/broccoli-svg-optimizer.svg?branch=master)](https://travis-ci.org/ivanvotti/broccoli-svg-optimizer)

Broccoli plugin for optimizing SVG files by [SVGO](https://github.com/svg/svgo) with a persistent cache for fast restarts.

## Installation

`npm install --save-dev broccoli-svg-optimizer`

## Usage

```js
var SVGOptimizer = require('broccoli-svg-optimizer');
var outputNode = new SVGOptimizer(inputNode, {
  persist: false,
  svgoConfig : {
    plugins: [
      { removeTitle: true }
    ]
  }
});
```

## Options

### persist

Type: `Boolean`
Default: `true`

Enable\disable a persistent cache to improve build performance across restarts. Check out [broccoli-persistent-filter](https://github.com/stefanpenner/broccoli-persistent-filter) for more details.

### svgoConfig

Type: `Object`
Default: `null`

Enable\disable\configure [SVGO](https://github.com/svg/svgo) plugins to customize SVG optimization. Most of the plugins are enabled by default. Check out [SVGO repository](https://github.com/svg/svgo/tree/master/plugins) for available options.

Example:

```js
svgoConfig : {
  plugins: [
    { removeUselessStrokeAndFill: false },
    { removeAttrs: { attrs: '(fill|fill-rule)' } },
    { removeTitle: true },
    { removeDesc: true }
  ]
}
```

## Running Tests

```
npm install
npm test
```

## License

This project is distributed under the MIT license.

---

GitHub [@ivanvotti](https://github.com/ivanvotti) &nbsp;&middot;&nbsp;
Twitter [@ivanvotti](https://twitter.com/ivanvotti)
