<h1 align="center">
  <img src="https://cdn.rawgit.com/ivanvotti/ember-svg-jar/master/logo.svg" alt="Logo" width="127px" height="131px">
  <br>
  <a href="https://svgjar.firebaseapp.com">Ember SVGJar</a>
  <br>
</h1>

<p align="center">
  <a href="https://travis-ci.org/ivanvotti/ember-svg-jar">
    <img src="https://travis-ci.org/ivanvotti/ember-svg-jar.svg?branch=master"
      alt="Build Status">
  </a>
  <a href="https://www.npmjs.com/package/ember-svg-jar">
    <img src="https://badge.fury.io/js/ember-svg-jar.svg"
      alt="NPM Version">
  </a>
  <a href="http://emberobserver.com/addons/ember-svg-jar">
    <img src="http://emberobserver.com/badges/ember-svg-jar.svg"
      alt="Ember Observer Score">
  </a>
</p>

<h4 align="center">
  The best way to embed SVG images into your Ember application
</h4>

![](https://s3-us-west-2.amazonaws.com/ivanvotti-uploads/SVGJar+0.9.1.png)

### Features

- a visual workflow to find and use your assets the fastest way possible
- automatic SVG optimization (it can cut file size by half or more)
- work out of the box (no configuration needed)
- an easy to use helper `{{svg-jar "asset-name"}}`
- support for both `inline` and `symbol` embedding methods

## Why does this matter?

[I know why. Just show me how to get started.](https://github.com/ivanvotti/ember-svg-jar#installation)

### Switching from Font Awesome to SVG will save you 80 Kb or even more:

- original Font Awesome is about `149 KB` as TTF and `88.3 KB` as WOFF
- it includes `634` icons and you need just some of them usually
- 20 Font Awesome icons in SVGJar will be about 4.3 KB (you save `84 KB` or `145 KB` as TTF)
- 50 Font Awesome icons in SVGJar will be about `9 KB`

You can get Font Awesome icons as individual SVG files from [font-awesome-svg](https://github.com/ivanvotti/font-awesome-svg):

`git clone git@github.com:ivanvotti/font-awesome-svg.git`

### SVG vs icon fonts

If you can go IE 9+ and Android 3+, SVG is a better solution than icon fonts. Also if your images are multi-coloured or involved in animation, you actually have to use SVG.

- [Why GitHub switched from an icon font to SVG](https://github.com/blog/2112-delivering-octicons-with-svg)
- ["Inline SVG vs icon fonts" from css-tricks](https://css-tricks.com/icon-fonts-vs-svg/)
- [Ten reasons to switch from an icon font to SVG](http://ianfeather.co.uk/ten-reasons-we-switched-from-an-icon-font-to-svg/)

## Installation

`$ ember install ember-svg-jar`

## Start in 4 easy steps

- Put some SVG files to any place in your project's `public` directory (e.g. get some from [font-awesome-svg](https://github.com/ivanvotti/font-awesome-svg))
- Run the development server and open this link with Chrome: <a href="http://localhost:4200/ember-svg-jar/index.html" target="_blank">http://localhost:4200/ember-svg-jar/index.html</a>
- Select any SVG there and press `Enter` to copy it to the clipboard.
- Paste it into any template and see it rendered in your browser.

## Usage in an app

Drag and drop SVG images to your project's `public` directory and copy & paste them from the <a href="http://localhost:4200/ember-svg-jar/index.html" target="_blank">assets viewer</a> to your templates.

The viewer is available at: <a href="http://localhost:4200/ember-svg-jar/index.html" target="_blank">http://localhost:4200/ember-svg-jar/index.html</a>

### Assets from Node modules

By default `ember-svg-jar` looks for SVGs in the `public` directory. To get SVGs from `node_modules` packages or any other directory you will need to add them to `ember-cli-build.js` like this:
```js
  var app = new EmberApp(defaults, {
    svgJar: {
      sourceDirs: [
        'node_modules/material-design-icons/file/svg/design',
        'node_modules/material-design-icons/action/svg/design',
        'public/images/icons'
      ]
    }
  });
```

[Click here for more configuration options](#configuration)

## Usage in an addon

Using `ember-svg-jar` in an addon is the same as in an app, except that in the `package.json`
of the addon, it should be listed as one of the `dependencies` and not `devDependencies`.

## Configuration

**Note:** Ember SVGJar should be useful without any configuration. But it wants to be very configurable when it's time to adjust it for your needs.

- [All configuration options](docs/configuration.md)
- [Advanced usage examples](docs/examples.md)

### Helper

Use the `svg-jar` helper to embed SVG images to your application's templates.

For the default `inline` embedding strategy you can write:

```handlebars
{{svg-jar "my-cool-icon" class="icon" width="24px"}}
```

The helper takes an asset ID and optional attributes that will be added to the created SVG element. The example above will create an SVG like this:

```handlebars
<svg class="icon" width="24px">...</svg>
```

For the `symbol` strategy you will need to add `#` to the asset ID like this:

```handlebars
{{svg-jar "#my-cool-icon"}}
```

In this case the result can look like this:

```handlebars
<svg><use xlink:href="#my-cool-icon"></use></svg>
```

## Compatibility

Latest ember-svg-jar `1.X.X` currently supports:
- Node `6.*` || >= `8.*`
- Ember >= `1.13.13`

The old addon versions <= v0.12.0 are compatible with old Node and Ember 1.10.1 and beyond.

## FAQ

Q: `Will the asset viewer affect my production build size?`  
A: `No, it won't at all. The asset viewer is included in development mode only.` 

Q: `Can it find SVG icons outside of the public directory, e.g. from node_modules?`  
A: `Yes, it can import SVGs from any directory defined in the sourceDirs array.`

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## Asset viewer

The viewer is a separate Ember application, which repository can be found at [this link](https://github.com/ivanvotti/svg-jar).

## License

This project is distributed under the MIT license.

---

GitHub [@ivanvotti](https://github.com/ivanvotti) &nbsp;&middot;&nbsp;
Twitter [@ivanvotti](https://twitter.com/ivanvotti)
