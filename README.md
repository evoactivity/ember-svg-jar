<h1 align="center">
  <img src="https://cdn.rawgit.com/ivanvotti/ember-svg-jar/master/svg-jar-logo.svg" alt="Standard" width="132px">
  <br>
  Ember SVGJar
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
  <a href="https://www.npmjs.com/package/ember-svg-jar">
    <img src="https://img.shields.io/npm/dm/ember-svg-jar.svg"
      alt="NPM Downloads">
  </a>
  <a href="http://emberobserver.com/addons/ember-svg-jar">
    <img src="http://emberobserver.com/badges/ember-svg-jar.svg"
      alt="Ember Observer Score">
  </a>
</p>

<h4 align="center">
  The best way to bring SVG goodness to your Ember application
</h4>

![](https://s3-us-west-2.amazonaws.com/ivanvotti-uploads/svg-jar-0.4.1.png)

### What’s in the Box?
- “install it and forget it” mode (no configuration needed)
- automatic SVG optimization (it can cut file size by half or more)
- a kick ass viewer to find and use your assets the fastest way possible
- a handy helper `{{svg-jar "asset-name"}}`
- support for both inline and symbol embedding methods

## Installation

`$ ember install ember-svg-jar`

## Try it in 4 easy steps

- Put some SVG files to any place in your `public` directory.
- Run the development server and open this link with Chrome:
`http://localhost:4200/ember-svg-jar/index.html`
- Select any SVG there and click `Enter` to copy it to the clipboard.
- Paste it into a template and see it rendered in your browser.

## Usage

Just drag and drop SVG images to your source directory and copy+paste them from the assets viewer to your templates.

The viewer is available at: `http://localhost:4200/ember-svg-jar/index.html`

The `svg-jar` helper supports the `class` attribute:

```handlebars
{{svg-jar "asset-name" class="icon icon-big"}}
```

## Compatibility

The addon is compatible with Ember 1.10.1 and beyond.

## Configuration

**Note:** In most of cases, Ember SVGJar should be useful without any configuration. But it wants to be very configurable when it's time to adjust it for your needs.

- [All configuration options](docs/configuration.md)
- [Advanced usage examples](docs/examples.md)

## Development setup

### Installation

* `git clone git@github.com:ivanvotti/ember-svg-jar.git`
* `npm install`
* `bower install`

### Building

* `npm run build`

### Running tests

* `ember try:each`
* `ember test`
* `ember test --server`

### Running the dummy app

* `ember server`
* Visit the app at http://localhost:4200

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

## Assets viewer

The viewer is a separate Ember application, which repository can be found at [this link](https://github.com/ivanvotti/svg-jar).

## License

This project is distributed under the MIT license.

---

GitHub [@ivanvotti](https://github.com/ivanvotti) &nbsp;&middot;&nbsp;
Twitter [@ivanvotti](https://twitter.com/ivanvotti)
