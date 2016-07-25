# Advanced usage examples

#### Setting where to find SVG files at `ember-cli-build.js`:

```javascript
let app = new EmberApp(defaults, {
  svgJar: {
    sourceDirs: ['svgs', 'public/images/svg']
  }
});
```

#### [`inline` strategy] custom ID generator:

```javascript
let app = new EmberApp(defaults, {
  svgJar: {
    inline: {
      idGen: (filePath) => filePath.replace(/\./g, '-')
    }
  }
});
```

#### Switching to `symbol` strategy:

```javascript
let app = new EmberApp(defaults, {
  svgJar: {
    strategy: 'symbol'
  }
});
```

#### [`symbol` strategy] ID prefix and a custom source directory:

```javascript
let app = new EmberApp(defaults, {
  svgJar: {
    strategy: 'symbol',

    symbol: {
      sourceDirs: ['public/images/icons'],
      prefix: 'icon-'
    }
  }
});
```

#### [`symbol` strategy] custom copypasta if you don't want to use the helper:

```javascript
let app = new EmberApp(defaults, {
  svgJar: {
    strategy: 'symbol',

    symbol: {
      copypastaGen: (svgID) => `<svg><use xlink:href="#${svgID}"></use></svg>`
    }
  }
});
```

#### [`symbol` strategy] disabled loader, custom copypasta and output path:

```javascript
let app = new EmberApp(defaults, {
  svgJar: {
    strategy: 'symbol',

    symbol: {
      includeLoader: false,
      outputFile: '/assets/symbol-defs.svg',
      copypastaGen: (svgID) => `<svg><use xlink:href="/assets/symbol-defs.svg#${svgID}"></use></svg>`
    }
  }
});
```

#### Using both `symbol` and `inline` strategies at the same time:

```javascript
let app = new EmberApp(defaults, {
  svgJar: {
    strategy: ['symbol', 'inline'],

    symbol: {
      sourceDirs: ['public/images/svg/icons']
    },

    inline: {
      sourceDirs: ['public/images/svg/illustrations']
    }
  }
});
```
