# Configuration options

This file still lacks good descriptions and examples. It will be improved soon.

## Setting some expectations

SVGJar is configurable via the `svgJar` object in the `ember-cli-build.js` file:

```javascript
// ember-cli-build.js

let app = new EmberApp(defaults, {
  svgJar: {
    strategy: 'inline'
  }
});
```

To make examples cleaner, we are going to use only this part:

```javascript
{
  svgJar: {
    strategy: 'inline'
  }
}
```

## Global options

All global options with their default values:

```javascript
{
  svgJar: {
    strategy: 'inline',
    sourceDirs: ['public'],
    stripPath: true,
    optimizer: {},
    persist: true,
    rootURL: '/',
    
    validations: {
      validateViewBox: true,
      checkForDuplicates: true
    }
  }
}
```

#### strategy

Type: `String` or `Array`  
Default: `'inline'`  
Choices: `'inline'`, `'symbol'`

Define enabled SVG embedding methods. You can enable all of them, or just one.

Example of using both `symbol` and `inline` strategies at the same time:

```javascript
{
  svgJar: {
    strategy: ['symbol', 'inline'],

    symbol: {
      sourceDirs: ['public/images/svg/icons']
    },

    inline: {
      sourceDirs: ['public/images/svg/illustrations']
    }
  }
}
```

#### sourceDirs (can be redefined on a strategy level)

Type: `Array`  
Default: `['public']`

Set directories that will be used to find your SVG images.

Example:

```javascript
let app = new EmberApp(defaults, {
  svgJar: {
    sourceDirs: ['svgs', 'public/images/svg']
  }
});
```

#### stripPath (can be redefined on a strategy level)

Type: `Boolean`  
Default: `true`

Remove filepaths from asset IDs.

#### optimizer (can be redefined on a strategy level)

Type: `Object` or `Boolean`  
Default: `{}`

Enable, disable or configure [SVGO](https://github.com/svg/svgo) plugins to customize SVG optimization. Most of the plugins are enabled by default. I'm going to add good examples later. For now, check out [SVGO repository](https://github.com/svg/svgo/tree/master/plugins) for available options.

*Note: You can completely disable SVG optimization by setting the option to `false`.*

Example:

```js
{
  svgJar: {
    optimizer : {
      plugins: [
        { removeUselessStrokeAndFill: false },
        { removeTitle: true }
      ]
    }
  }
}
```

#### persist

Type: `Boolean`  
Default: `true`

Enable or disable a persistent cache to improve build performance across restarts. Check out [broccoli-persistent-filter](https://github.com/stefanpenner/broccoli-persistent-filter) for more details.

#### rootURL

Type: `String`  
Default: `/`

It's useful in development mode, if you use custom `rootURL` in `config/environment.js`. By default, the SVGJar viewer is available at `http://localhost:4200/ember-svg-jar/index.html`. If you set `rootURL` to `/myapp/`, the viewer URL will change to `http://localhost:4200/myapp/ember-svg-jar/index.html`. If you use the symbol strategy, it will also prefix `outputFilepath` in the [symbols loader script](#includeloader).

Example:

```javascript
let isDevelopment = EmberApp.env() === 'development';

let app = new EmberApp(defaults, {
  svgJar: {
    rootURL: (isDevelopment && '/myapp/') || '/'
  }
});
```

#### validations

Type: `Object`  
Default: `{ validateViewBox: true, checkForDuplicates: true }`

By default SVGJar checks your assets with some validations and emits warning
messages if it finds any problems. You can suppress the warnings by setting
particular validations to `false`.

`validateViewBox` -- It shows all SVGs without viewBox. SVGs without viewBox are not correctly scalable.

`checkForDuplicates` -- It shows all assets with not unique asset IDs. Asset IDs
must be unique to embed SVGs correctly.

Example (we only disable `validateViewBox` here):

```javascript
{
  svgJar: {
    validations: {
      validateViewBox: false
    }
  }
}
```

## Inline strategy options

All the `inline` strategy options with their default values:

```javascript
{
  svgJar: {
    strategy: 'inline',

    inline: {
      idGen: (filepath) => filepath,
      copypastaGen: (assetId) => `{{svg-jar "${assetId}"}}`,

      // The options below can be used to rewrite the global onces.
      sourceDirs: ['public'],
      stripPath: true,
      optimizer: {}
    }
  }
}
```

#### idGen

Type: `Function`  
Default: `(filepath) => filepath`

This option accepts a function which takes a relative SVG filepath and returns a string which will be used as an ID for this asset.

#### copypastaGen

Type: `Function`  
Default: ``(assetId) => `{{svg-jar "${assetId}"}}` ``

The function takes an asset ID and returns a string which will be used as a copypasta in the assets viewer.

## Symbol strategy options

All the `symbol` strategy options with their default values:

```javascript
{
  svgJar: {
    strategy: 'symbol',

    symbol: {
      idGen: (path, { prefix }) => `${prefix}${path}`.replace(/[\s]/g, '-'),
      copypastaGen: (assetId) => `{{svg-jar "#${assetId}"}}`,
      outputFile: '/assets/symbols.svg',
      prefix: '',
      includeLoader: true,

      // The options below can be used to rewrite the global onces.
      sourceDirs: ['public'],
      stripPath: true,
      optimizer: {}
    }
  }
}
```

#### idGen

Type: `Function`  
Default: ``(path, { prefix }) => `${prefix}${path}`.replace(/[\s]/g, '-')``

This option accepts a function which takes a relative SVG filepath and a symbol ID prefix. It returns a string which will be used as the asset ID.

#### copypastaGen

Type: `Function`  
Default: ``(assetId) => `{{svg-jar "#${assetId}"}}` ``

The function takes an asset ID and returns a string which will be used as a copypasta in the assets viewer.

#### outputFile

Type: `String`  
Default: `'/assets/symbols.svg'`

A path to the SVG file (symbols-container) that will content all SVG images for this strategy combined as symbol elements.

The symbols-container file example:

```xml
<svg style="position: absolute; width: 0; height: 0;" width="0" height="0" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <symbol id="asset-one" viewBox="0 0 32 32">
    <path d="M1 86.96V87z"/>
  </symbol>
  <symbol id="asset-two" viewBox="0 0 24 24">
    <path d="M2 16.96V1z"/>
  </symbol>
</svg>
```

#### prefix

Type: `String`  
Default: `''`

A string that is used to prefix each symbol ID.

#### includeLoader

Type: `Boolean`  
Default: `true`

When it's `true`, the symbols-container loader will be included to the `{{content-for "body"}}` section of your `index.html`. The loader will request the symbols-container via AJAX and inject its contents into the `<body>` element.

The loader example:

```html
<script>
  var ajax = new XMLHttpRequest();
  ajax.open('GET', '{{outputFilepath}}', true);
  ajax.send();
  ajax.onload = function(e) {
    var div = document.createElement('div');
    div.innerHTML = ajax.responseText;
    document.body.insertBefore(div, document.body.childNodes[0]);
  };
</script>
```

## Viewer options

#### enabled

Type: `Boolean`  
Default: `true` for `development`

Need description...

#### embed

Type: `Boolean`  
Default: `true` for `development`

Need description...
