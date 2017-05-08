<h1 align="center">
  <img src="https://cdn.rawgit.com/ivanvotti/ember-svg-jar/master/svgjar-logo.svg" alt="Standard" width="132px">
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
- an easy to use helper `{{svg-jar "asset-name"}}`
- automatic SVG optimization (it can cut file size by half or more)
- a visual workflow to find and use your assets the fastest way possible
- work out of the box (no configuration needed)
- support for both inline and symbol embedding methods

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

- Put some SVG files to any place in your `public` directory (e.g. get some from [font-awesome-svg](https://github.com/ivanvotti/font-awesome-svg))
- Run the development server and open this link with Chrome:
`http://localhost:4200/ember-svg-jar/index.html`
- Select any SVG there and click `Enter` to copy it to the clipboard.
- Paste it into a template and see it rendered in your browser.

## Usage

Drag and drop SVG images to your source directory (`public` by default) and copy & paste them from the viewer to your templates.

The viewer is available at: `http://localhost:4200/ember-svg-jar/index.html`

### Helper

Use the `svg-jar` helper to embed SVG images to your application's templates:

```handlebars
{{svg-jar "my-cool-icon" class="icon" width="24px"}}
```

The helper takes an asset ID and optional attributes that will be added to the created SVG element. The example above will create an SVG like this:

```handlebars
<svg class="icon" width="24px">...</svg>
```

## Compatibility

The addon is compatible with Ember 1.10.1 and beyond.

## Configuration

**Note:** Ember SVGJar should be useful without any configuration. But it wants to be very configurable when it's time to adjust it for your needs.

- [All configuration options](docs/configuration.md)
- [Advanced usage examples](docs/examples.md)

## Development setup

### Installation

* `git clone git@github.com:ivanvotti/ember-svg-jar.git`
* `npm install`
* `bower install`

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

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

## Asset viewer

The viewer is a separate Ember application, which repository can be found at [this link](https://github.com/ivanvotti/svg-jar).

## License

This project is distributed under the MIT license.

---

GitHub [@ivanvotti](https://github.com/ivanvotti) &nbsp;&middot;&nbsp;
Twitter [@ivanvotti](https://twitter.com/ivanvotti)
