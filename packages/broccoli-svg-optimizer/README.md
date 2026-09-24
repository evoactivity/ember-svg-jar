# broccoli-svg-optimizer

[![Build Status](https://travis-ci.org/voltidev/broccoli-svg-optimizer.svg?branch=master)](https://travis-ci.org/voltidev/broccoli-svg-optimizer)
[![Build status](https://ci.appveyor.com/api/projects/status/26lyufkk6ueam952/branch/master?svg=true)](https://ci.appveyor.com/project/voltidev/broccoli-svg-optimizer)

Broccoli plugin for optimizing SVG files by [SVGO](https://github.com/svg/svgo) with a persistent cache for fast restarts.

## Installation

`npm install --save-dev broccoli-svg-optimizer`

## Usage

```js
var SVGOptimizer = require('broccoli-svg-optimizer');
var outputNode = new SVGOptimizer(inputNode, {
  persist: false,
  svgoConfig: {
    plugins: [{ removeTitle: true }],
  },
});
```

## Options

### svgoConfig

Type: `Object`  
Default: `null`

Configures [SVGO](https://github.com/svg/svgo). The bundled version is SVGO 4. Two config formats are accepted.

The SVGO 4 format is passed to SVGO unchanged. Plugins are listed by name, and `preset-default` enables the SVGO 4 default plugins. See the [SVGO plugin list](https://svgo.dev/docs/plugins/) for available plugins and params.

```js
svgoConfig: {
  plugins: [
    'preset-default',
    'removeDimensions',
    { name: 'removeAttrs', params: { attrs: '(fill|fill-rule)' } },
  ],
}
```

The SVGO 1 format lists each plugin as an object with the plugin name as its key. This format is converted to SVGO 4, starting from the plugins that SVGO 1.3.0 enabled by default. A config with no `plugins` list is also treated as the SVGO 1 format, so it keeps the SVGO 1 default plugins.

```js
svgoConfig: {
  plugins: [
    { removeUselessStrokeAndFill: false },
    { removeAttrs: { attrs: '(fill|fill-rule)' } },
    { removeTitle: true },
    { removeDesc: { removeAny: true } },
  ],
}
```

The two formats cannot be mixed in one `plugins` list. Custom SVGO 1 plugins (objects with a `fn`) cannot be converted and must be rewritten as SVGO 4 plugins.

Output from a converted SVGO 1 config is close to SVGO 1 output but not always identical. SVGO 4 writes some path data differently, and it removes unreferenced elements such as a `<symbol>` that nothing uses.

### svgoModule

Type: reference to a custom `svgo` module  
Default: `svgo` module defined in `broccoli-svg-optimizer` dependencies

Sets a custom `svgo` module. SVGO 2 and later export an `optimize` function, and SVGO 1 exports a class; both are supported. An SVGO 1 module receives `svgoConfig` unchanged.

Example:

```js
const SVGOptimizer = require('broccoli-svg-optimizer');

let outputNode = new SVGOptimizer(inputNode, {
  svgoModule: require('svgo'),
});
```

### persist

Type: `Boolean`  
Default: `true`

Enable\disable a persistent cache to improve build performance across restarts. Check out [broccoli-persistent-filter](https://github.com/stefanpenner/broccoli-persistent-filter) for more details.

## Running Tests

```
npm install
npm test
```

## License

This project is distributed under the MIT license.

---

GitHub [@voltidev](https://github.com/voltidev) &nbsp;&middot;&nbsp;
Twitter [@voltidev](https://twitter.com/voltidev)
