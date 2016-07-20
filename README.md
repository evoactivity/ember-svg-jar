<h1 align="center">
  <img src="https://cdn.rawgit.com/ivanvotti/ember-svg-jar/master/svg-jar-logo.svg" alt="Standard" width="132px">
  <br>
  Ember SVGJar
  <br>
</h1>

<h4 align="center">
  The best way to bring SVG goodness to your Ember application
</h4>

![](https://s3-us-west-2.amazonaws.com/ivanvotti-uploads/svg-jar-0.4.1.png)

### What’s in the Box?
- “install it and forget it” mode (no configuration needed)
- automatic SVG optimization (it can cut file size by half or more)
- a kick ass viewer for SVG assets with keyboard shortcuts
- a handy helper `{{svg-jar "asset-name"}}`
- support for both inline and symbol embedding methods

## Installation

`$ ember install ember-svg-jar`

## Try it in 4 easy steps

- Put some SVG files to any place in your `public` directory.

- Run the development server and open this link with Chrome:
`http://localhost:4200/ember-svg-jar/index.html`

- Select any SVG there and click `Enter` to copy it to the clipboard.

- Paste it into a template and see it rendered in your browser

## Advanced usage examples

**Note:** In most of cases, Ember SVGJar should be useful without any configuration. But it wants to be very configurable when it's time to adjust it for your needs.

Real documentation with all available options and better examples is coming soon.

##### Adding CSS classes in the helper:

```handlebars
{{svg-jar "asset-name" class="icon icon-big"}}
```

##### Setting where to find SVG files at `ember-cli-build.js`:

```javascript
var app = new EmberApp(defaults, {
  svgJar: {
    sourceDirs: ['svgs', 'public/images/svg']
  }
});
```

##### [`inline` (default) strategy] custom ID generator:

```javascript
var app = new EmberApp(defaults, {
  svgJar: {
    inline: {
      idGen: function(filePath) {
        return filePath.replace(/\./g, '-');
      }
    }
  }
});
```

##### Switching to `symbol` strategy:

```javascript
var app = new EmberApp(defaults, {
  svgJar: {
    strategy: 'symbol'
  }
});
```

##### [`symbol` strategy] ID prefix and a custom source directory:

```javascript
var app = new EmberApp(defaults, {
  svgJar: {
    strategy: 'symbol',

    symbol: {
      sourceDirs: ['public/images/icons'],
      prefix: 'icon-'
    }
  }
});
```

##### [`symbol` strategy] custom copypasta if you don't want to use the helper:

```javascript
var app = new EmberApp(defaults, {
  svgJar: {
    strategy: 'symbol',

    symbol: {
      copypastaGen: function(svgID) {
        return '<svg><use xlink:href="#' + svgID + '"></use></svg>';
      }
    }
  }
});
```

##### [`symbol` strategy] disabled loader, custom copypasta and output path:

```javascript
var app = new EmberApp(defaults, {
  svgJar: {
    strategy: 'symbol',

    symbol: {
      includeLoader: false,
      outputFile: '/assets/symbol-defs.svg',

      copypastaGen: function(svgID) {
        return '<svg><use xlink:href="/assets/symbol-defs.svg#' + svgID + '"></use></svg>';
      }
    }
  }
});
```

##### Using both `symbol` and `inline` strategies at the same time:

```javascript
var app = new EmberApp(defaults, {
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

## Docs and tests

It's still an early beta. Docs and tests are coming soon.

## License

This project is distributed under the MIT license.

---

GitHub [@ivanvotti](https://github.com/ivanvotti) &nbsp;&middot;&nbsp;
Twitter [@ivanvotti](https://twitter.com/ivanvotti)
