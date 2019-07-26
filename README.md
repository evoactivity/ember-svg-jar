<p align="center">
  <a href="https://svgjar.web.app" target="_blank">
    <img src="https://svgjar.web.app/images/logo-96eaca43925f5d648acc8193b1b9ddd7.png" width="125px" height="120px" alt="Logo">
  </a>
</p>

<h3 align="center">
  Best way to use SVG images in Ember apps.
</h3>

<p align="center">
  <a href="https://travis-ci.org/ivanvotti/ember-svg-jar" target="_blank">
    <img src="https://travis-ci.org/ivanvotti/ember-svg-jar.svg?branch=master"
      alt="Build Status">
  </a>
  <a href="https://www.npmjs.com/package/ember-svg-jar" target="_blank">
    <img src="https://img.shields.io/npm/v/ember-svg-jar.svg?color=informational" />
  </a>
  <a href="https://www.npmjs.com/package/ember-svg-jar" target="_blank">
    <img src="https://img.shields.io/npm/dm/ember-svg-jar.svg?color=informational" />
  </a>
  <a href="http://emberobserver.com/addons/ember-svg-jar" target="_blank">
    <img src="http://emberobserver.com/badges/ember-svg-jar.svg" alt="Ember Observer Score">
  </a>
</p>

![](https://s3-us-west-2.amazonaws.com/ivanvotti-uploads/SVGJar+0.9.1.png)

## Table of Contents

<!-- toc -->

- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Installation](#installation)
- [Start in 4 easy steps](#start-in-4-easy-steps)
- [Usage in an app](#usage-in-an-app)
  - [Assets from Node modules](#assets-from-node-modules)
- [Usage in an addon](#usage-in-an-addon)
- [Configuration](#configuration)
  - [Helper](#helper)
- [Compatibility](#compatibility)
- [FAQ](#faq)
- [Why does this matter?](#why-does-this-matter)
  - [SVG vs icon fonts](#svg-vs-icon-fonts)
  - [Switching from Font Awesome](#switching-from-font-awesome)
- [Contributing](#contributing)
- [Asset viewer](#asset-viewer)
- [License](#license)

<!-- tocstop -->

## Features

- a visual workflow to find and use your assets the fastest way possible
- automatic SVG optimization (it can cut file size by half or more)
- work out of the box (no configuration needed)
- an easy to use helper `{{svg-jar "asset-name"}}`
- support for both `inline` and `symbol` embedding methods

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

Q: `Why the SVG files deployed into the dist/assets folder without being fingerprinted?`  
A: `This is done with the default ember cli behaviour.` For more information see [SVG Fingerprinting](docs/svg-fingerprinting.md).

## Why does this matter?

### SVG vs icon fonts

If you can go IE 9+ and Android 3+, SVG is a better solution than icon fonts. Also if your images are multi-coloured or involved in animation, you actually have to use SVG.

- [Why GitHub switched from an icon font to SVG](https://github.com/blog/2112-delivering-octicons-with-svg)
- ["Inline SVG vs icon fonts" from css-tricks](https://css-tricks.com/icon-fonts-vs-svg/)
- [Ten reasons to switch from an icon font to SVG](http://ianfeather.co.uk/ten-reasons-we-switched-from-an-icon-font-to-svg/)

### Switching from Font Awesome

- original Font Awesome is about `149 KB` as TTF and `88.3 KB` as WOFF
- it includes `634` icons and you need just some of them usually
- 20 Font Awesome icons in SVGJar will be about 4.3 KB (you save `84 KB` or `145 KB` as TTF)
- 50 Font Awesome icons in SVGJar will be about `9 KB`

You can get Font Awesome icons as individual SVG files from [font-awesome-svg](https://github.com/ivanvotti/font-awesome-svg):

`git clone git@github.com:ivanvotti/font-awesome-svg.git`

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## Asset viewer

The viewer is a separate Ember application, which repository can be found at [this link](https://github.com/ivanvotti/svg-jar).

## License

This project is distributed under the MIT license.

---

GitHub [@ivanvotti](https://github.com/ivanvotti) &nbsp;&middot;&nbsp;
Twitter [@ivanvotti](https://twitter.com/ivanvotti)
